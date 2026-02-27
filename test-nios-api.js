require('dotenv').config();
const axios = require('axios');

const NIOS4_TOKEN = process.env.NIOS4_TOKEN;
const NIOS4_DB = process.env.NIOS4_DB;

async function testNios4() {
    const filter = encodeURIComponent("stato='Aperto'");
    const urls = [
        `https://web.nios4.com/ws/model?database=${NIOS4_DB}&table=ticket&filter=${filter}`,
        `https://web.nios4.com/ws/model?database=${NIOS4_DB}&table=ticket`,
        `https://web.nios4.com/ws/sync?database=${NIOS4_DB}`
    ];

    for (const url of urls) {
        console.log(`\nTesting URL: ${url}`);
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${NIOS4_TOKEN}`
                },
                timeout: 5000
            });
            console.log(`SUCCESS! Status: ${response.status}`);
            console.log('Data sample:', JSON.stringify(response.data).substring(0, 200));
        } catch (error) {
            if (error.response) {
                console.log(`FAILED. Status: ${error.response.status}`);
                console.log(`Data: ${JSON.stringify(error.response.data)}`);
            } else {
                console.log(`FAILED. Message: ${error.message}`);
            }
        }
    }
}

testNios4();
