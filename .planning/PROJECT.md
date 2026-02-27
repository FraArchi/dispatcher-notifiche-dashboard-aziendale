# PROJECT: Dispatcher Notifiche D-TEC

## Objective
Realizzare un sistema di notifica attiva e bloccante per i nuovi ticket di assistenza di AM Tecnology. Il sistema deve garantire che l'operatore si accorga istantaneamente dei nuovi ticket creati dai clienti sul sito web, forzando la presa visione tramite un allarme acustico e un banner a tutto schermo con countdown.

## Context
- **Customer:** AM Tecnology S.r.l. (Grottaminarda, AV)
- **Platform:** D-TEC (built on Nios4 framework)
- **Integration:** Nios4 REST API / Webhooks
- **Tech Stack:** Node.js (Server), HTML/CSS/JS (Frontend/Client)

## Success Criteria
1. Ricezione istantanea dei nuovi ticket tramite webhook o polling veloce.
2. Riproduzione di un segnale acustico all'arrivo di un ticket.
3. Visualizzazione di un banner bloccante "sopra ogni finestra" con countdown.
4. Possibilità di aprire direttamente la scheda del ticket su Nios4 (deep-linking).
5. Logging delle notifiche e delle prese visione.
