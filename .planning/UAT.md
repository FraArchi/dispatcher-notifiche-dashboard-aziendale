# UAT: Dispatcher Notifiche D-TEC

## Test 1: Connettività Browser -> Localhost (Secure Context)
- **Descrizione:** Verificare se la dashboard ospitata su GitHub Pages (HTTPS) può comunicare con il server locale (HTTP localhost).
- **Risultato:** ❌ FALLITO (Inizialmente) -> ✅ RISOLTO (Con patch header PNA)
- **Note:** Aggiunto header `Access-Control-Allow-Private-Network` in `server.js`. Chrome ora permette la richiesta preflight.

## Test 2: Proxy API Nios4
- **Descrizione:** Verificare se l'endpoint `/api/ticket` del server locale recupera correttamente i dati da Nios4.
- **Risultato:** ❌ FALLITO (500 Error)
- **Diagnosi:** Il server Nios4 risponde con **404 Not Found** all'indirizzo `https://web.nios4.com/ws/model`.
- **Azione richiesta:** L'utente deve confermare l'URL corretto per le API Nios4 di AM Tecnology.

## Test 3: Interfaccia di Allarme (Mock Mode)
- **Descrizione:** Verificare che il banner rosso e l'audio funzionino in modalità simulata.
- **Risultato:** ✅ SUPERATO
- **Note:** Il sistema di allarme (Wave 1 e 2) è stato verificato con successo tramite i trigger di test nella dashboard.

---
**Diagnosi Finale:** Il sistema è pronto e configurato correttamente, ma la connessione "live" con Nios4 è interrotta a causa di un URL API non valido o cambiato lato Nios4.
