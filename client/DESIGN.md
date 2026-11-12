# Design: work.jorgebucio.com

Working design document for the portfolio. It follows the creative-direction brief outline and the quality rubric (version 1, 2026-11-04). Implementation and review must preserve the decisions below; change them only with the owner's word.

## Audience and outcome

- **Audience (hypothesis):** hiring managers, recruiters and engineers deciding whether Jorge Bucio (@ZynzTehr) can build ambitious, finished software; collaborators looking for a partner.
- **Core task:** see real work fast. Open a project, judge it from live media, launch the build or read the source.
- **Journey:** a short prologue, then the orbit of recent work, then the full index, then a closing transmission with the next step (profile hub, GitHub).
- **Intended recall (hypothesis):** "the portfolio where the work orbits a planet and every effect was hand-built." The visitor should leave believing the craft claim because the site itself is the evidence.
- **Decisions already made by the owner:** keep the globe and the 3D carousel; pure craft / mission story (biography lives on jorgebucio.com); every effect in `upgrades.md` at its exact configured props, with green `#4ade80` tinted to ice `#60a5fa`; Fleet Pulse pixel-ripple surface on every text button and the hex button; the restored spiraling orbit particles around the landing headline; Canvas UI Ripple added; ship to a Vercel preview first.

## Direction

- **Expression: immersive.** The subject is creative engineering; the site is its own proof, so spectacle is evidence, not decoration. Every act still keeps the core task one click away (Skip on the prologue, cards always clickable, live/source links on every project).
- **Organizing idea: a mission in orbit around one persistent object, the sapphire hex-orbit mark.** It is the subject's own mark (the hex already anchors the HUD here, and the orbit is the site's whole premise), so it fails the swap test for any other brand. Its roles:
  1. Prologue: the spiraling orbit particles circle the call sign; the mark locks on in the viewfinder.
  2. Launch: the particles spiral inward and the mark expands into the route cover.
  3. Orbit: the cover collapses into the HUD hex button (dock); the globe carries the orbit ring.
  4. Index: the laser horizon is the orbit line seen edge-on; cards print out of it.
  5. Transmission: the mark returns to sign off.
     The favicon is the same mark.
- **References studied:** MyNewAgent `reports/Website motion and interaction analysis.md` (2026-11-04). Principles used: a recognizable object survives changes of state (Lando portrait, Enjoy monitor); object versus context in a stable card frame (Lando helmet cards: SVG art at rest, live media on hover); a brand cover that conceals route changes (Lando navigation); motion reviewed as sequences, not stills. Limits: the dossier's own; no exact timings are copied.
- **Motion grammar (deliberately limited):** AsciiSweep for page-load and beat-swap text; rectangular sapphire masks for section headings; Laser plus ParticleScroll for content emergence; DecryptReveal and Asciify for media; pixel-ripple and Ripple for touch feedback; Liquid for the cursor; GlyphRain as the prologue and stage atmosphere. No other ad-hoc fades.

## Visual and content system

### Palette roles (existing tokens, `src/styles/index.css`)

| Role                          | Token                                                  | Value                             |
| ----------------------------- | ------------------------------------------------------ | --------------------------------- |
| Void, document background     | `--bg-void`                                            | `#03060f`                         |
| Page canvas                   | `--bg-base`                                            | `#060b19`                         |
| Raised surfaces               | `--surface-1` / `--surface-2`                          | `#0a1124` / `#0e1730`             |
| Laser core, deep action       | `--accent-core`                                        | `#0d59ff`                         |
| Primary accent, the mark      | `--accent-primary`                                     | `#4474ff`                         |
| Highlight, shader tint, focus | `--accent-bright`                                      | `#60a5fa`                         |
| Availability only             | `--status-live`                                        | `#34d399`                         |
| Text                          | `--text-primary` / `--text-secondary` / `--text-muted` | `#f4f7ff` / `#b8c6e8` / `#8396c2` |

One accent family (cobalt to ice) works as a moving system: the laser, the rain, the cursor fluid, the pixel tiles and the mark all share it.

### Typography

- **Display: Space Grotesk.** Geometric with quirks in the R, G and t; it carries the call sign, act titles and project names.
- **Utility layer: JetBrains Mono, with a job.** Telemetry: act kickers, counters, tags, stack chips, coordinates. Uppercase, tracked, tabular numerals.
- **Body: Plus Jakarta Sans.** Descriptions and controls.
- Registers meet on purpose: a mono kicker sits directly against a display headline in every act.

### Voice and vocabulary

Mission vocabulary used sparingly and consistently: signal, craft, launch, orbit, index, transmission. Actions are named for what they do ("Launch", "Open live build", "View source", "Back to orbit"). No "decrypt", "dossier", "materialize" or "command deck". No invented statistics: every number on the site is computed from `projects.json`.

### Copy (prologue beats)

| Beat | Kicker | Headline                | Line                                                                          |
| ---- | ------ | ----------------------- | ----------------------------------------------------------------------------- |
| 01   | SIGNAL | Zynz Tehr               | Jorge Bucio, full-stack and creative systems engineer                         |
| 02   | CRAFT  | Built from a blank file | Hand-written WebGL shaders, real-time systems and interfaces that answer back |
| 03   | LAUNCH | {n} systems in orbit    | {live} running live. All of them open source.                                 |

### Asset plan

| Asset                                                                             | Role                                           | Source / method                                                           | Rights                             | Format                                       | Responsive / fallback                                  |
| --------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Hex-orbit mark                                                                    | Persistent object, favicon, hex button glyph   | Concept in Google Flow (owner's account), final hand-built vector         | Owner's own generation and drawing | SVG; ICO 16/32/48; PNG 180/192/512, maskable | Vector scales; PNG fallbacks                           |
| OG plate                                                                          | Social preview                                 | Google Flow image plus typeset name                                       | Owner's own generation             | PNG 1200x630                                 | n/a                                                    |
| Project snapshots                                                                 | Card hover context, stage media                | Live captures of each repo's deployed app (`portfolio.webp` at repo root) | Owner's own work                   | WebP 1440x900                                | SVG art at rest; image error falls back to the SVG art |
| Non-web project screens (school-directory, python-rock-paper-scissors, vscode-fx) | Same as snapshots                              | Google Flow images grounded in the real repo content                      | Owner's own generation             | WebP 1440x900 in `public/media/<id>/`        | Same                                                   |
| Motion clips                                                                      | Hover and stage video for motion-rich projects | Screen captures; Flow image-to-video for non-web repos                    | Owner's own                        | MP4, silent, about 300 KB                    | Poster image; never on reduced motion                  |
| Earth textures                                                                    | Globe                                          | Existing `src/assets/earth_*.{jpg,png}`                                   | Already in repo                    | JPG/PNG                                      | Globe hidden if WebGL fails                            |

## Interaction and states (motion contracts)

Durations come from `src/lib/motion.ts`: micro 0.18s, ui 0.32s, reveal 0.64s, hero 0.9s; ease out `cubic-bezier(0.16, 1, 0.3, 1)`, in-out `power3.inOut`.

| Scene                  | Trigger                              | What it communicates                                 | Settled state                            | Interruption                                                                     | Reduced motion                                                      |
| ---------------------- | ------------------------------------ | ---------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Prologue beats         | Load; stepper pills; Skip            | Identity, craft claim, scale of work                 | Beat 03 with Launch CTA                  | Pills jump to a beat; Skip launches immediately                                  | Beat 03 shown statically with CTA; particles as a static faint ring |
| Launch                 | Launch CTA or Skip                   | Leaving the prologue into the work                   | Home with docked hex                     | Repeated clicks ignored while running; back button returns to a settled prologue | Short crossfade                                                     |
| HUD dock               | Arrival on Home                      | The mark is now the navigation anchor                | Hex button with glyph; HUD text swept in | n/a                                                                              | Static HUD                                                          |
| Card object to context | Pointer enter, focus                 | The SVG art is the idea; the media is the real thing | Media visible, decoded                   | Exit restores art even mid-reveal; moving to the next card restores the previous | Media swap without shader                                           |
| Stage                  | Card click or Enter                  | Full project detail                                  | Notched media left, details right        | Esc closes with exit motion; arrows step; focus returns to the card              | Instant open and close                                              |
| Index ignition         | Search click or focus, ignite prompt | The whole body of work, emerging from the orbit line | Grid visible, laser idle                 | Typing filters with FLIP                                                         | Grid visible, no laser sweep                                        |
| Transmission           | Scroll into view                     | Sign-off and next step                               | Stats counted, CTAs visible              | n/a                                                                              | Final numbers shown                                                 |

Keyboard: every action reachable by Tab; visible focus ring in ice; the stage traps no keys from inputs. Touch: no hover-only content; cards open on tap. Optional media: when WebGL or video fails, content and actions remain.

## Acceptance and evidence

| Intended outcome                                                                              | Check and conditions                                                                                                                                               | Evidence or remaining gap                     |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| Award-caliber craft: every criterion at 9 or above on the shipped scale of the quality rubric | Scored on the running build with browser recordings; accessibility and performance passed as separate gates                                                        | Scorecard with evidence for the lowest scores |
| upgrades.md fidelity                                                                          | Each of the 7 effects: props equal the spec (ice tint is the only sanctioned change), placement equals the instruction, described behavior observed in a recording | Per-effect checklist and recordings           |
| Orbit particles restored                                                                      | Same path, 4.5s period and 0.26s stagger as commit e041095, in the new palette                                                                                     | Side-by-side recording                        |
| Build health                                                                                  | `tsc -b`, `vp check`, `vp build` with 0 errors and 0 warnings; build succeeds with the GitHub API unreachable                                                      | Command output                                |
| Runtime health                                                                                | 0 console errors; peak live WebGL contexts at most 8                                                                                                               | Instrumented Playwright run                   |
| Accessibility gate                                                                            | Keyboard traversal, focus return, axe-core clean, contrast 4.5:1 including text under the Liquid trail, reduced-motion run shows all content                       | Playwright and axe output                     |
| Performance gate                                                                              | LCP under 2.5s, CLS under 0.1, INP under 200ms (lab, device stated)                                                                                                | Trace numbers                                 |

## Deliberate trade-offs

- **Native HTML-in-canvas** is enabled where the effect wraps a bounded block (AsciiSweep, DecryptReveal, GlyphRain on the landing page, Asciify, Ripple). Liquid, Laser and ParticleScroll keep their DOM fallback paths on this site: their native modes require wrapping the page or the archive in a fixed-height inner-scroll canvas, and Laser and ParticleScroll would nest one capture canvas inside another. The fallback still renders their described behavior.
- **DecryptReveal** mounts on hover only (cards rest on their SVG art, per the owner's earlier direction). The decode radius animates from 0 to the configured 400 on entry so the cipher-to-image decode is visible.

## Implementation handoff

- Spec sources: `../upgrades.md` (effects), this document (journey, motion, copy), the approved plan.
- Unresolved: final mark geometry (picked from Flow concepts and the design gauntlet); Flow-generated screens pending owner review.
