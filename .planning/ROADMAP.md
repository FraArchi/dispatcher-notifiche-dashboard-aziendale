# ROADMAP: Dispatcher Notifiche D-TEC

## Phase 1: Core Server & Real-time Communication
- [x] Setup Express.js server with Socket.io.
- [x] Implement a basic Webhook listener endpoint (`/webhook/new-ticket`).
- [x] Verify message propagation from server to connected clients.
- [x] Basic logging of incoming requests.

## Phase 2: Blocking UI & Multimedia
**Requirements:** [FR-3, FR-4, FR-5, FR-6]
**Plans:** 2 plans
- [x] 02-01-PLAN.md — Enhanced UI (Portal-style) and WAAPI countdown.
- [x] 02-02-PLAN.md — Gapless AudioBuffer alarm and acknowledgment logic.

## Phase 2.1: Nios4 Node.js SDK Implementation
**Requirements:** [FR-1, FR-2]
**Plans:** 2 plans
- [ ] 02.1-01-PLAN.md — SDK Foundation (Utility + Client Class).
- [ ] 02.1-02-PLAN.md — Server Integration & Verification.

## Phase 3: Nios4 Integration
- [ ] Configure Nios4 API credentials (via .env).
- [ ] Implement payload parsing for Nios4 webhooks.
- [ ] Generate Nios4 deep-links for the "Open Ticket" button.
- [ ] Implement optional polling as fallback for webhooks.

## Phase 4: Persistence & UX
- [ ] Add a notification history view in the main UI.
- [ ] Improve visual aesthetics (animations, responsive design).
- [ ] Final E2E testing with simulated Nios4 events.
- [ ] Documentation and deployment instructions.
