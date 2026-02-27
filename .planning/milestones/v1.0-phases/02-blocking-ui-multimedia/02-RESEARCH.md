# Phase 2: Blocking UI & Multimedia - Research

**Researched:** 2024-10-24
**Domain:** Frontend UI/UX, Web Audio API, Animations
**Confidence:** HIGH

## Summary

This phase focuses on the "Invasive" part of the dispatcher: a fullscreen overlay that blocks all other interactions until a ticket is acknowledged, accompanied by a looping acoustic alarm. Research confirms that modern browsers require explicit user gestures to enable audio and that GPU-accelerated CSS/WAAPI is the standard for smooth countdown animations.

**Primary recommendation:** Use the **Web Animations API (WAAPI)** for the countdown bar to get CSS performance with JavaScript control, and implement a mandatory "System Start" interaction to unlock the Web Audio context for the acoustic alarm.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | ES2022+ | Logic | No framework overhead needed for simple overlays |
| Web Audio API | Standard | Acoustic Alarm | Precision timing and seamless looping |
| CSS3 | Modern | Layout | Native `inset` and `dvh` units solve positioning |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Web Animations API | Native | Countdown Bar | When precision + performance are both needed |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── client/
│   ├── components/
│   │   ├── Overlay.js       # Handles DOM creation/visibility
│   │   ├── Alarm.js         # Web Audio API wrapper
│   │   └── Countdown.js     # WAAPI logic
│   └── styles/
│       └── overlay.css      # Positioning and z-index
```

### Pattern 1: Audio Unlock Pattern
**What:** Browsers block audio until a user clicks.
**When to use:** On application load.
**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function initAudio() {
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  console.log('Audio Context Unlocked');
}

// Attach to a "Start/Login" button
document.getElementById('start-btn').addEventListener('click', initAudio);
```

### Pattern 2: Bulletproof Overlay
**What:** Fixed positioning that survives viewport changes.
**When to use:** Blocking UI.
**CSS:**
```css
.blocking-overlay {
  position: fixed;
  inset: 0;                /* top, bottom, left, right = 0 */
  height: 100dvh;          /* dynamic viewport height for mobile */
  width: 100vw;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Anti-Patterns to Avoid
- **`setInterval` for Progress Bars:** Leads to "stuttery" visuals and clock drift. Use CSS transitions or WAAPI.
- **Inline Z-Index:** Hard to manage. Use a central CSS variable for stacking.
- **Autoplay without Check:** Attempting to play sound without checking `audioCtx.state` will lead to silent failures in the console.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Precision Looping | `HTMLAudioElement.loop` | `AudioBufferSourceNode` | HTML5 audio loops often have "gaps" at the loop point. |
| Modal Positioning | Complex JS resize listeners | `100dvh` and `inset: 0` | CSS now handles dynamic viewports natively. |

## Common Pitfalls

### Pitfall 1: The "Z-Index War"
**What goes wrong:** Overlay appears *behind* a sidebar or header despite `z-index: 9999`.
**Why it happens:** Stacking contexts. If the header is in a different stacking context (e.g. parent has `transform` or `opacity`), Z-index is relative only to that context.
**How to avoid:** Append the overlay directly to `document.body` (Portal pattern).

### Pitfall 2: Silent Alarm (Tab Backgrounding)
**What goes wrong:** Browser throttles the countdown or audio when the tab is in the background.
**How to avoid:** Use `AudioContext` (which is highly prioritized by browsers) and ensure the "Acknowledge" interaction happens in the foreground.

## Code Examples

### Countdown with WAAPI
```javascript
const bar = document.querySelector('.countdown-bar');
const duration = 60000; // 60 seconds

const animation = bar.animate([
  { transform: 'scaleX(1)' },
  { transform: 'scaleX(0)' }
], {
  duration: duration,
  easing: 'linear',
  fill: 'forwards'
});

animation.onfinish = () => {
  console.log("Time is up! Triggering fallback escalation...");
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `top:0; left:0; right:0; bottom:0` | `inset: 0` | 2021/2022 | Cleaner CSS, wider browser support now |
| `100vh` | `100dvh` | 2023 | Prevents UI clipping on mobile browsers with toolbars |
| `setTimeout` for progress | Web Animations API | 2020+ | GPU acceleration + JS lifecycle events |

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FR-3 | Acoustic Alarm | Web Audio API `AudioBufferSourceNode` loop verified for seamless playback. |
| FR-4 | Blocking Banner | `inset: 0` and `100dvh` pattern documented for full coverage. |
| FR-5 | Countdown Timer | WAAPI `scaleX` approach recommended for smoothness and accuracy. |
| FR-6 | Interaction Options | Multimodal signaling (visual/audio) and "Portal" pattern for button focus. |

## Sources

### Primary (HIGH confidence)
- MDN Web Audio API - Autoplay policy and context resuming.
- CSS Spec - `inset` and `dvh` units support.
- Web Animations API Specification.

### Secondary (MEDIUM confidence)
- Google Developers - Best practices for attention-grabbing notifications (2024).

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH - Core web APIs are stable.
- Architecture: HIGH - Modal/Portal pattern is industry standard.
- Pitfalls: HIGH - Autoplay/Z-index issues are well-documented.

**Research date:** 2024-10-24
**Valid until:** 2025-04-24
