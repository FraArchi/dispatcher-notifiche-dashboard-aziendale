# STATE: Dispatcher Notifiche D-TEC

## Current Status
- Project initialized.
- Research completed for Phase 2.
- Phase 1 Completed:
    - Express server with Socket.io implemented.
    - Webhook listener endpoint created.
    - Socket.io client integrated into `dispatcher.html`.
    - .env configuration for Nios4 credentials.
- Phase 2 Planned:
    - 02-01-PLAN.md: Enhanced UI & Countdown.
    - 02-02-PLAN.md: Multimedia & Acknowledge logic.

## Active Phase
- **Phase 2: Blocking UI & Multimedia**

## Next Steps
1. Execute Plan 02-01: Refine overlay and implement WAAPI countdown.
2. Execute Plan 02-02: Implement gapless alarm and acknowledgment sync.

## Blockers
- None.

## Decisions
- Used Socket.io for real-time updates.
- Using WAAPI for countdown instead of CSS transitions or setInterval.
- Using AudioBufferSourceNode for gapless looping.
- Mandatory "System Start" interaction to unlock Web Audio.
