const Nios4Client = require('./Nios4Client');
const nios4Utility = require('./Nios4Utility');

// Mocking axios
const mockAxios = {
    get: async (url, config) => {
        console.log(`GET ${url}`, JSON.stringify(config.params));
        return { data: [{ gguid: '123', name: 'test' }] };
    },
    post: async (url, data, config) => {
        console.log(`POST ${url}`, JSON.stringify(config.params), JSON.stringify(data));
        return { data: { success: true } };
    }
};

async function test() {
    const client = new Nios4Client({
        baseUrl: 'http://mock',
        database: 'db',
        token: 'token'
    });

    // Replace internal client with mock
    client.client = mockAxios;

    console.log('--- Testing find_records ---');
    const records = await client.find_records('table', 'id=1');
    if (records[0].gguid !== '123') throw new Error('find_records failed');

    console.log('--- Testing get_record ---');
    const record = await client.get_record('table', '123');
    if (record.gguid !== '123') throw new Error('get_record failed');

    console.log('--- Testing save_record (existing) ---');
    await client.save_record('table', { gguid: '123', name: 'updated' }, false);

    console.log('--- Testing save_record (new) ---');
    await client.save_record('table', { name: 'new' }, true);

    console.log('Verification PASSED');
}

test().catch(err => {
    console.error('Verification FAILED:', err);
    process.exit(1);
});
