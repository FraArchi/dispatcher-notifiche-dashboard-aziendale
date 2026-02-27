# Phase 2: Blocking UI & Multimedia - Research

**Researched:** 2024-05-24
**Domain:** Frontend UI/UX, Web Audio API, CSS Animations
**Confidence:** MEDIUM (Based on internal knowledge and project context, external verification interrupted)

## Summary

This phase focuses on creating a high-urgency notification system that demands immediate user attention. The primary challenges are bypassing browser autoplay restrictions for the alarm and ensuring the UI remains truly "blocking" and accessible.

**Primary recommendation:** Use a fixed-position overlay with a high z-index and focus-trapping logic, combined with a pre-initialized `AudioContext` that resumes on the first user interaction with the application.

## User Constraints (from CONTEXT.md)

*No CONTEXT.md found. Using requirements from REQUIREMENTS.md and STATE.md.*

### Locked Decisions
- Tech stack: Vanilla JS, CSS, Socket.io.
- Real-time communication via Socket.io.
- "Acknowledge" (Prendi in Carico) and "Open Ticket" (Deep-link) buttons.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FR-3 | Acoustic Alarm | Web Audio API implementation with interaction-based resumption. |
| FR-4 | Blocking Banner | CSS Fixed-position overlay with z-index management. |
| FR-5 | Countdown Timer | CSS transitions synchronized with JS timer logic. |
| FR-6 | Interaction Options | Button patterns for high-urgency acknowledgment. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Web Audio API | Native | Audio handling | Low-level control for looping and state management. |
| Vanilla JS | ES6+ | UI Logic | Minimal overhead, native performance. |
| CSS3 | Latest | Layout & Anim | High performance for visual overlays and progress bars. |

## Architecture Patterns

### Recommended Project Structure
```
public/
├── css/
│   └── notifications.css   # Styles for blocking overlay and animations
├── js/
│   ├── audio-manager.js    # Logic for alarm sound and AudioContext
│   └── ui-manager.js       # Logic for banner, countdown, and focus trapping
└── assets/
    └── alarm.mp3           # High-urgency audio file
```

### Pattern 1: Focus Trapping
To ensure the user cannot interact with the background while the notification is active:
1. Set `aria-hidden="true"` and `inert` (if supported) on the main content container.
2. Intercept `Tab` key events within the overlay to cycle focus between the "Acknowledge" and "Open Ticket" buttons.

### Anti-Patterns to Avoid
- **Hand-rolling audio loops with `<audio>` tags:** Native HTML5 audio tags often have gaps in looping. Web Audio API's `AudioBufferSourceNode` provides gapless loops.
- **Using `z-index: 999999` without stacking context knowledge:** Ensure the overlay is a direct child of `<body>` to avoid context isolation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus Trapping | Complex event listeners | `inert` attribute / Focus-trap logic | Browsers are optimizing accessibility; `inert` is the future-proof way. |
| Gapless Audio | Recursive `play()` calls | `AudioBufferSourceNode.loop = true` | Prevents audible "clicks" or delays between loop cycles. |

## Common Pitfalls

### Pitfall 1: Autoplay Policy
**What goes wrong:** The alarm fails to sound because the browser blocks audio until a user interaction.
**How to avoid:** Implement a "Start" or "Enable Notifications" button on initial app load that resumes the `AudioContext`. Once resumed, future socket-triggered sounds will play.

### Pitfall 2: Mobile Browser Backgrounding
**What goes wrong:** Browsers may throttle JS/Audio when the tab is not in focus.
**How to avoid:** While limited, using `requestAnimationFrame` for the countdown and ensuring the `AudioContext` state is checked upon tab refocus can help.

## Code Examples

### Web Audio API Loop
```javascript
let audioCtx;
let buffer;

async function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('assets/alarm.mp3');
    const arrayBuffer = await response.arrayBuffer();
    buffer = await audioCtx.decodeAudioData(arrayBuffer);
}

function playAlarm() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.loop = true;
    source.start(0);
    return source; // Store to call stop() later
}
```

### CSS Countdown Progress Bar
```css
.progress-bar {
    width: 100%;
    height: 10px;
    background: #ddd;
}
.progress-fill {
    width: 100%;
    height: 100%;
    background: red;
    transition: width 60s linear; /* Match countdown duration */
}
.active .progress-fill {
    width: 0%;
}
```

## Open Questions

1. **Native Fullscreen vs. Full-window Overlay:**
   - What we know: Native Fullscreen API requires a fresh user gesture.
   - What's unclear: If the "Acknowledge" interaction can trigger native fullscreen for subsequent events.
   - Recommendation: Use a full-window fixed overlay as it is more reliable and less intrusive for desktop users.

## Sources

### Primary (HIGH confidence)
- MDN Web Audio API Documentation
- MDN Focus Trapping / Accessibility Guidelines
- CSS-Tricks: Guide to CSS Transitions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native web standards.
- Architecture: MEDIUM - Focus trapping and audio resumption are well-known but require careful implementation.
- Pitfalls: HIGH - Browser autoplay restrictions are a documented industry standard.

**Research date:** 2024-05-24
**Valid until:** 2024-12-24
