# Powerhouse Promo Video — Remotion Components

Programmatic video components for the Powerhouse investor promo video intro (1:34).

## Quick View

Visit the deployed viewer to preview all rendered clips with voiceover context.

## Interactive Studio

```bash
git clone https://github.com/0xkilgore/powerhouse-promo-video.git
cd powerhouse-promo-video
npm install
npm run dev
```

Open http://localhost:3000 — scrub through compositions, adjust props, re-render.

## Components

| Component | Shot | Description |
|---|---|---|
| `TerminalTyping` | 3b | Green terminal text typing with cursor blink |
| `KineticTextStack` | 3a | Words stacking with glitch/impact effect |
| `ColorSpectrumShift` | 9 | Terminal boot-up, green monochrome → full color |
| `NodeNetwork` | 11, 16-18 | Configurable node/connection particle system |
| `ModuleAssembly` | 14 | Floating modules snapping together |
| `ThreeTierStack` | 15 | Three-tier structure building upward |
| `LogoResolve` | 19 | Particles converge into Powerhouse logo |

## Render

```bash
# Render a specific composition
npx remotion render src/index.ts TerminalTyping out/terminal.mp4

# Render all compositions
npm run render-all
```

## Production Notes

These clips are designed to be assembled in Descript alongside:
- Stock footage (shots 1, 2, 3a background, 5, 7)
- Screen recordings (shots 2, 6, 10, 12)
- Text overlays added in Descript/CapCut
- AI-generated clips as fallback (shots 7, 8)

See `resources/promo-video-intro-storyboard.md` for the full production plan.
