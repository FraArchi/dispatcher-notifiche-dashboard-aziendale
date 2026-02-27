# STATE: Dispatcher Notifiche D-TEC

## Current Status
- Phase 2: Blocking UI & Multimedia (Completed & Verified).
- Phase 2.1: Nios4 Node.js SDK Implementation (Inserted & Active).
- Research on Nios4 Python libraries completed; strategy for Node.js adaptation defined.

## Active Phase
- **Phase 2.1: Nios4 Node.js SDK Implementation**

## Next Steps
1. Creare `Nios4Utility.js` per la gestione dei TID (YYYYMMDDHHMMSS).
2. Sviluppare la classe `Nios4Client.js` per centralizzare le chiamate REST.
3. Testare l'autenticazione e il recupero record con il nuovo client.

## Blockers
- None.

## Decisions
- Maintain Node.js stack but port Python API logic.
- Implement TID generation locally to match Nios4 requirements.
- Use the `/ws/model` endpoint as confirmed by the libraries.
