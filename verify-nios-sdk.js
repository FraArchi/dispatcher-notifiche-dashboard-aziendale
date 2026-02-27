require('dotenv').config();
const Nios4Client = require('./Nios4Client');

async function verifySDK() {
    console.log('--- Nios4 SDK Verification ---');
    
    const NIOS4_TOKEN = process.env.NIOS4_TOKEN;
    const NIOS4_DB = process.env.NIOS4_DB;

    if (!NIOS4_TOKEN || !NIOS4_DB) {
        console.error('ERROR: Missing NIOS4_TOKEN or NIOS4_DB in .env file');
        process.exit(1);
    }

    const nios4 = new Nios4Client({
        baseUrl: 'https://web.nios4.com/ws',
        database: NIOS4_DB,
        token: NIOS4_TOKEN
    });

    try {
        console.log('Testing connectivity (find_records on ticket table)...');
        const tickets = await nios4.find_records('ticket', "stato='Aperto'");
        
        if (Array.isArray(tickets)) {
            console.log(`SUCCESS: Found ${tickets.length} open tickets.`);
            
            if (tickets.length > 0) {
                const firstTicket = tickets[0];
                console.log(`Verifying get_record for ticket GGUID: ${firstTicket.gguid}...`);
                const ticket = await nios4.get_record('ticket', firstTicket.gguid);
                
                if (ticket && ticket.gguid === firstTicket.gguid) {
                    console.log('SUCCESS: get_record returned the correct ticket.');
                } else {
                    console.error('FAILURE: get_record failed to return the expected ticket.');
                    process.exit(1);
                }
            }
        } else {
            console.error('FAILURE: find_records did not return an array. Response:', tickets);
            process.exit(1);
        }

        console.log('--- SDK Verification Passed ---');
        process.exit(0);

    } catch (error) {
        console.error('--- SDK Verification Failed ---');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Message: ${error.message}`);
        }
        process.exit(1);
    }
}

verifySDK();
