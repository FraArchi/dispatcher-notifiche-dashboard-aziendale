const axios = require('axios');
const nios4Utility = require('./Nios4Utility');

/**
 * Nios4Client encapsulates the Nios4 Web API logic.
 */
class Nios4Client {
    /**
     * @param {Object} options
     * @param {string} options.baseUrl - Base URL for Nios4 API (e.g., https://web.nios4.com/ws)
     * @param {string} options.database - Nios4 database name
     * @param {string} options.token - Bearer token for authentication
     */
    constructor({ baseUrl, database, token }) {
        this.baseUrl = baseUrl || 'https://web.nios4.com/ws/';
        if (!this.baseUrl.endsWith('/')) {
            this.baseUrl += '/';
        }
        this.database = database;
        this.token = token;
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Verifies connectivity or performs login (if token not present).
     * @returns {Promise<boolean>}
     */
    async login() {
        if (!this.token) {
            throw new Error("Token authentication required. Login with credentials not yet implemented.");
        }
        try {
            // Test connectivity with a minimal query
            await this.find_records('_tables', 'limit 1');
            return true;
        } catch (error) {
            console.error('Nios4 login/connectivity check failed:', error.message);
            return false;
        }
    }

    /**
     * Retrieves a single record by its GGUID.
     * @param {string} tablename 
     * @param {string} gguid 
     * @returns {Promise<Object|null>}
     */
    async get_record(tablename, gguid) {
        const filter = `gguid='${gguid}'`;
        const records = await this.find_records(tablename, filter);
        return Array.isArray(records) && records.length > 0 ? records[0] : null;
    }

    /**
     * Finds records in a table matching a filter.
     * @param {string} tablename 
     * @param {string} filter - SQL-like filter string
     * @returns {Promise<Array>}
     */
    async find_records(tablename, filter = '') {
        const params = {
            database: this.database,
            table: tablename
        };
        if (filter) {
            params.filter = filter;
        }

        console.log(`Nios4Client: Requesting GET ${this.client.defaults.baseURL}model with params:`, params);
        const response = await this.client.get('model', { params });
        // Nios4 API usually returns the array of records directly or in a specific property.
        // Based on test-nios-api.js, we assume response.data contains the records.
        return response.data;
    }

    /**
     * Saves a record to Nios4.
     * @param {string} tablename 
     * @param {Object} record 
     * @param {boolean} is_new - If true, assigns new GGUID and TID
     * @returns {Promise<Object>}
     */
    async save_record(tablename, record, is_new = false) {
        const data = { ...record };
        if (is_new) {
            data.gguid = data.gguid || nios4Utility.gguid();
            data.tid = data.tid || nios4Utility.tid();
        }

        const params = {
            database: this.database,
            table: tablename
        };

        const response = await this.client.post('model', data, { params });
        return response.data;
    }
}

module.exports = Nios4Client;
