---
status: testing
phase: 03-nios4-integration
source: 03-VERIFICATION.md
started: 2026-02-27T15:16:50Z
updated: 2026-02-27T15:29:25Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 2
name: Real-time Ticket Mapping on Alert
expected: |
  When a new ticket event arrives, the alert UI shows mapped ticket fields correctly (including gguid/title) without missing critical data.
awaiting: user response

## Tests

### 1. Webhook HMAC Validation
expected: Sending a webhook request with a valid HMAC signature is accepted (2xx), while an invalid signature is rejected with 401.
result: issue
reported: "dalla pagina web di server.js, da errori di content security process e status 404 poi schermata bianca con cannot get. Puuoi dirmi inoltre se devpo aggiungere delle configurazioni manuali o credenziali o variabili di env? e poi dirmi dove andare a inserirle. ad esempio come ottengo una HMAC signature e dove devo inserirla se devo inserirla?"
severity: blocker

### 2. Real-time Ticket Mapping on Alert
expected: When a new ticket event arrives, the alert UI shows mapped ticket fields correctly (including gguid/title) without missing critical data.
result: [pending]

### 3. Deep-link Opens Correct Ticket
expected: Clicking "Prendi in Carico" opens `https://web.dtec.one/scheda/{gguid}` for the currently displayed ticket.
result: [pending]

### 4. Polling Fallback Receives Open Tickets
expected: With polling fallback enabled, newly open Nios4 tickets still appear as alerts even if webhook delivery is unavailable.
result: [pending]

### 5. Deduplication Across Webhook and Socket Path
expected: Re-sending the same ticket event (same gguid) does not trigger duplicate alert notifications in the same session.
result: [pending]

### 6. Blocking Alert View Integrity
expected: During an active alert, the blocking alert view remains full-screen and usable on mobile/desktop until the operator action is taken.
result: [pending]

## Summary

total: 6
passed: 0
issues: 1
pending: 5
skipped: 0

## Gaps

- truth: "Sending a webhook request with a valid HMAC signature is accepted (2xx), while an invalid signature is rejected with 401."
  status: failed
  reason: "User reported: dalla pagina web di server.js, da errori di content security process e status 404 poi schermata bianca con cannot get. Puuoi dirmi inoltre se devpo aggiungere delle configurazioni manuali o credenziali o variabili di env? e poi dirmi dove andare a inserirle. ad esempio come ottengo una HMAC signature e dove devo inserirla se devo inserirla?"
  severity: blocker
  test: 1
  artifacts: []
  missing: []
