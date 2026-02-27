require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const Nios4Client = require('./Nios4Client');

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

// Inizializza il client Nios4
const nios4 = new Nios4Client({
    baseUrl: 'https://web.nios4.com/ws',
    database: NIOS4_DB,
    token: NIOS4_TOKEN
});

// Set per la deduplicazione dei ticket notificati
const processedTickets = new Set();

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
    const signature = req.headers['x-nios4-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (secret && signature) {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
        
        if (signature !== digest) {
            console.error('Invalid Webhook signature');
            return res.status(401).send('Invalid signature');
        }
    } else if (secret && !signature) {
        console.warn('Webhook received without signature, but WEBHOOK_SECRET is set.');
        // For security, we might want to reject this in production.
        // For now, we'll just log it.
    }

    const niosPayload = req.body;
    
    // Mappatura payload Nios4 -> Formato Interno
    const ticketData = {
        id: niosPayload.id_referenza || niosPayload.id || 'N/D',
        cliente: niosPayload.cliente || 'Cliente Sconosciuto',
        oggetto: niosPayload.oggetto || 'Nessun oggetto',
        gguid: niosPayload.gguid,
        status: niosPayload.stato || 'Aperto',
        timestamp: new Date().toISOString()
    };

    if (ticketData.gguid) {
        processedTickets.add(ticketData.gguid);
    }

    console.log('Nuovo ticket ricevuto via Webhook:', ticketData);
    
    // Notifica tutti i client connessi via Socket.io
    io.emit('new-ticket', ticketData);
    
    res.status(200).send('Webhook ricevuto');
});

// Funzione di Polling Fallback
async function runPolling() {
    try {
        console.log(`[Polling] Esecuzione polling per nuovi ticket 'Aperto'...`);
        const records = await nios4.find_records('ticket', "stato='Aperto'");
        
        if (records && Array.isArray(records)) {
            let newTicketsFound = 0;
            records.forEach(record => {
                if (!processedTickets.has(record.gguid)) {
                    processedTickets.add(record.gguid);
                    newTicketsFound++;

                    const ticketData = {
                        id: record.id_referenza || record.id || 'N/D',
                        cliente: record.cliente || 'Cliente Sconosciuto',
                        oggetto: record.oggetto || 'Nessun oggetto',
                        gguid: record.gguid,
                        status: record.stato || 'Aperto',
                        timestamp: new Date().toISOString()
                    };

                    console.log(`[Polling] Nuovo ticket trovato: ${ticketData.gguid}`);
                    io.emit('new-ticket', ticketData);
                }
            });
            console.log(`[Polling] Completato. Nuovi ticket notificati: ${newTicketsFound}`);
        }
    } catch (error) {
        console.error("[Polling] Errore:", error.message);
    }
}

// Avvio Polling se abilitato
if (process.env.ENABLE_POLLING === 'true') {
    const interval = parseInt(process.env.POLLING_INTERVAL_MS) || 30000;
    console.log(`[Polling] Polling abilitato ogni ${interval}ms`);
    setInterval(runPolling, interval);
    // Prima esecuzione immediata
    setTimeout(runPolling, 5000);
}

// Endpoint proxy per polling manuale (fallback)
app.get('/api/ticket', async (req, res) => {
    try {
        console.log(`Tentativo di recupero ticket da Nios4 tramite SDK...`);
        const records = await nios4.find_records('ticket', "stato='Aperto'");
        
        console.log(`Risposta da Nios4 via SDK: SUCCESS - Data count: ${Array.isArray(records) ? records.length : 'N/A'}`);
        res.json(records);
    } catch (error) {
        console.error("Errore SDK Nios4 dettagliato:");
        if (error.response) {
            console.error(`- Status: ${error.response.status}`);
            console.error(`- Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`- Message: ${error.message}`);
        }
        res.status(500).json({ error: 'Errore di connessione a Nios4 via SDK', detail: error.message });
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
