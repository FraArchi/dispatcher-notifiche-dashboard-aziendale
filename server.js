require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const NIOS4_TOKEN = process.env.NIOS4_TOKEN;
const NIOS4_DB = process.env.NIOS4_DB;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Private-Network"]
}));

// Middleware per abilitare Private Network Access (Chrome requirement for HTTPS -> Localhost)
app.use((req, res, next) => {
    if (req.headers['access-control-request-private-network']) {
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    next();
});

app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Endpoint per i Webhook da Nios4
app.post('/webhook/new-ticket', (req, res) => {
    const ticketData = req.body;
    console.log('Nuovo ticket ricevuto via Webhook:', ticketData);
    
    // Notifica tutti i client connessi via Socket.io
    io.emit('new-ticket', ticketData);
    
    res.status(200).send('Webhook ricevuto');
});

// Endpoint proxy per polling manuale (fallback)
app.get('/api/ticket', async (req, res) => {
    try {
        const niosUrl = `https://web.nios4.com/ws/model?database=${NIOS4_DB}&table=ticket&filter=stato%3D%27Aperto%27`;
        console.log(`Tentativo di chiamata a Nios4: ${niosUrl}`);
        
        const response = await axios.get(niosUrl, {
            headers: {
                'Authorization': `Bearer ${NIOS4_TOKEN}`
            },
            timeout: 5000 // Aggiungiamo un timeout per evitare attese infinite
        });
        
        console.log(`Risposta da Nios4: ${response.status} - Data count: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
        res.json(response.data);
    } catch (error) {
        console.error("Errore Proxy dettagliato:");
        if (error.response) {
            console.error(`- Status: ${error.response.status}`);
            console.error(`- Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`- Message: ${error.message}`);
        }
        res.status(500).json({ error: 'Errore di connessione a Nios4', detail: error.message });
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Un client si è connesso:', socket.id);

    socket.on('ticket-acknowledged', (data) => {
        console.log(`[ACK] Ticket ${data.gguid} preso in carico da ${data.operatoreNome} (${data.operatoreId}) alle ${data.timestamp}`);
        // Broadcast a tutti gli altri client per informare della presa in carico
        socket.broadcast.emit('ticket-remote-ack', data);
    });

    socket.on('disconnect', () => {
        console.log('Un client si è disconnesso:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server Dispatcher in ascolto su http://localhost:${PORT}`);
});
