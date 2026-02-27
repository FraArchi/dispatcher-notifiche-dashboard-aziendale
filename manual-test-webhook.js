const axios = require('axios');
const crypto = require('crypto');

const secret = 'nios4_secret_key_2024';
const payload = {
    id_referenza: 'TK-123',
    cliente: 'Test Client',
    oggetto: 'Broken Printer',
    gguid: '550e8400-e29b-41d4-a716-446655440000',
    stato: 'Aperto'
};

const signature = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

async function testWebhook() {
    try {
        console.log('Sending signed webhook...');
        const response = await axios.post('http://localhost:3000/webhook/new-ticket', payload, {
            headers: {
                'x-nios4-signature': signature
            }
        });
        console.log('Success:', response.status, response.data);

        console.log('
Sending unsigned webhook (should warn/accept based on current logic)...');
        const response2 = await axios.post('http://localhost:3000/webhook/new-ticket', payload);
        console.log('Success:', response2.status, response2.data);

        console.log('
Sending invalid signature...');
        try {
            await axios.post('http://localhost:3000/webhook/new-ticket', payload, {
                headers: {
                    'x-nios4-signature': 'wrong_signature'
                }
            });
        } catch (error) {
            console.log('Rejected as expected:', error.response.status, error.response.data);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testWebhook();
