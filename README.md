# CUBE X — 3D Cube Studio

A mobile-first, dark-mode 3D Rubik's Cube simulator built with HTML, CSS, JavaScript modules, and Three.js.

## Features

- Actual 3D cubies and animated layer rotations for 2×2, 3×3, 6×6, and 8×8 puzzles.
- Face controls for R/L/U/D/F/B quarter turns, inverse turns, and half turns.
- Drag-to-orbit camera, wheel zoom, preset views, and responsive controls.
- Shuffle, undo, redo, reset, move history, move counter, and session timer.
- Local PNG/JPEG/WebP image application to all faces or a selected face. Files are processed in the browser and not uploaded.
- Adjustable animation speed, optional subtle sound, reduced motion, and basic PWA caching.
- Custom SVG cube favicon and responsive layout.

## Run locally

Use a local HTTP server because the app uses ES modules and a service worker. From the `cube-x` directory, run one of:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. Node users can use `npx serve .` instead.

## Dependencies and network

- Three.js 0.170.0 loaded from jsDelivr as an ES module.
- Manrope and DM Mono fonts are loaded from Google Fonts; system fallbacks are included.
- A network connection is needed for first-time loading of the Three.js CDN module and web fonts. The service worker caches same-origin app files but does not cache CDN dependencies, so full offline operation is **not guaranteed**.

## Solver behavior and limitations

The “AI Solve” control uses the application's recorded legal move path and plays the inverse sequence to return to the solved state. It is a deterministic move-history solver, not an AI service or a general-purpose solver. It can solve states reached through recorded moves in the current session; it does **not** infer a solution for arbitrary manually configured/imported cube states. The interface explicitly describes this limitation.

The cube-state engine supports face turns, inner-slice notation such as `2R`, and wide-turn notation such as `Rw` / `2Rw` for larger cubes. The visible controls provide outer-face turns. Custom image application is a visual treatment and does not change puzzle logic.

## Testing

Run the state-engine tests from this directory:

```bash
node --test tests/cube-tests.js
```

These tests cover supported sizes, inverse moves, half turns, four-turn identity, and cubie coordinate validity. They do not replace full browser/device testing of WebGL, touch input, or GPU performance.

## Browser compatibility

A recent Chrome, Edge, Firefox, or Safari with WebGL 2 and ES module support is recommended. Performance depends on device/GPU. If WebGL is unavailable, the UI displays a fallback message.
