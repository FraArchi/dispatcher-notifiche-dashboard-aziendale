# REQUIREMENTS: Dispatcher Notifiche D-TEC

## Functional Requirements (FR)
1. **Real-time Monitoring:** Il sistema deve monitorare la creazione di nuovi ticket su D-TEC (Nios4).
2. **Webhook Listener:** Implementare un endpoint HTTP POST per ricevere eventi di creazione ticket da Nios4.
3. **Acoustic Alarm:** All'attivazione di una notifica, il client deve riprodurre un suono di allarme ripetuto.
4. **Blocking Banner:** Mostrare un banner a tutto schermo (overlay) che copre l'interfaccia utente.
5. **Countdown Timer:** Il banner deve includere un countdown (es. 60 secondi).
6. **Interaction Options:**
    - Bottone "Prendi in Carico" (Acknowledge).
    - Bottone "Apri Scheda D-TEC" (Deep-link).
7. **Forced Focus:** Tentare di portare la finestra del browser in primo piano (nei limiti del browser).
8. **Notification History:** Visualizzare una lista delle ultime notifiche ricevute.

## Non-Functional Requirements (NFR)
1. **Low Latency:** La notifica deve apparire entro 2 secondi dall'evento sul server.
2. **Reliability:** Il sistema deve essere resiliente a disconnessioni di rete (auto-reconnect).
3. **Browser Compatibility:** Supportare gli ultimi browser moderni (Chrome/Edge/Firefox).
4. **Visibility:** Il banner deve essere visivamente impattante (colori vivaci, animazioni).

## Technical Constraints
- Utilizzare Node.js per la parte server.
- Utilizzare WebSockets (es. Socket.io) per la comunicazione real-time server-client.
- Integrazione con API Nios4 (Bearer Token).
