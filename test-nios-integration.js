const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const BASE_URL = `http://localhost:${PORT}`;

async function testWebhookSignature() {
    console.log('--- Testing Webhook Signature Verification ---');
    
    const payload = {
        id: '123',
        cliente: 'Test Client',
        oggetto: 'Test Issue',
        gguid: 'test-gguid-' + Date.now(),
        stato: 'Aperto'
    };

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const validSignature = hmac.update(JSON.stringify(payload)).digest('hex');

    // 1. Test Valid Signature
    try {
        console.log('Sending valid signature...');
        const resValid = await axios.post(`${BASE_URL}/webhook/new-ticket`, payload, {
            headers: { 'x-nios4-signature': validSignature }
        });
        console.log('Valid signature response:', resValid.status, resValid.data);
    } catch (error) {
        console.error('Valid signature FAILED:', error.response ? error.response.status : error.message);
    }

    // 2. Test Invalid Signature
    try {
        console.log('Sending invalid signature...');
        const resInvalid = await axios.post(`${BASE_URL}/webhook/new-ticket`, payload, {
            headers: { 'x-nios4-signature': 'wrong_signature' }
        });
        console.log('Invalid signature response (SHOULD NOT REACH HERE):', resInvalid.status);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Invalid signature correctly rejected with 401');
        } else {
            console.error('Invalid signature test FAILED (unexpected error):', error.message);
        }
    }
}

async function testPollingDeduplication() {
    console.log('\n--- Testing Polling Deduplication ---');
    console.log('This test assumes the server is running with ENABLE_POLLING=true');
    console.log('Check server logs to verify that the same gguid is not notified twice.');
    
    const gguid = 'dedup-test-' + Date.now();
    const payload = {
        id: '456',
        cliente: 'Dedup Client',
        oggetto: 'Dedup Issue',
        gguid: gguid,
        stato: 'Aperto'
    };

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const signature = hmac.update(JSON.stringify(payload)).digest('hex');

    console.log(`Sending ticket ${gguid} via webhook...`);
    await axios.post(`${BASE_URL}/webhook/new-ticket`, payload, {
        headers: { 'x-nios4-signature': signature }
    });

    console.log(`Sending ticket ${gguid} via webhook AGAIN...`);
    await axios.post(`${BASE_URL}/webhook/new-ticket`, payload, {
        headers: { 'x-nios4-signature': signature }
    });
}

async function runTests() {
    try {
        await testWebhookSignature();
        await testPollingDeduplication();
        console.log('\nTests completed.');
    } catch (error) {
        console.error('Test suite failed:', error.message);
    }
}

runTests();
