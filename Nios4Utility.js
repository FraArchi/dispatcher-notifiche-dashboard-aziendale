const crypto = require('crypto');

/**
 * Returns a numeric string in YYYYMMDDHHMMSS format (UTC).
 * @returns {string}
 */
function tid() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    
    return now.getUTCFullYear().toString() +
           pad(now.getUTCMonth() + 1) +
           pad(now.getUTCDate()) +
           pad(now.getUTCHours()) +
           pad(now.getUTCMinutes()) +
           pad(now.getUTCSeconds());
}

/**
 * Returns a UUID v4 string.
 * @returns {string}
 */
function gguid() {
    return crypto.randomUUID();
}

module.exports = {
    tid,
    gguid
};
