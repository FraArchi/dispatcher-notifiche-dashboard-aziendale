const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Questo abilita il CORS per TUTTI (risolve il problema del browser)
app.use(cors());

// Endpoint proxy
app.get('/api/ticket', async (req, res) => {
    try {
        const token = "e9b5ddc844acd1456416971d3145e2ca"; // Il tuo token
        const db = "dtec3701";

        // Costruiamo la URL per Nios4 (filtrando per stato='Aperto') senza il token
        const niosUrl = `https://web.nios4.com/ws/model?database=${db}&table=ticket&filter=stato%3D%27Aperto%27`;

        // Il nostro server fa la chiamata a Nios4 passando il token via Header
        const response = await axios.get(niosUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Restituiamo i dati puliti al browser
        res.json(response.data);

    } catch (error) {
        console.error("Errore Proxy:", error.message);
        res.status(500).json({ error: 'Errore di connessione a Nios4' });
    }
});

app.listen(port, () => {
    console.log(`Proxy in ascolto su http://localhost:${port}`);
});


