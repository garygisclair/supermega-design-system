# Supermega Design System — Claude Code Instructions

## Purpose

Figma → React.js via **Figma MCP**. No scripts. No Storybook. **Claude Code is the pipeline.**
Output is portable TSX + CSS that can be dropped into any React project.

A lightweight Vite dev server handles browser preview.

---

## How It Works

```
User: "implement <ComponentName> from Figma node <nodeId>"
Claude:
  1. get_design_context(nodeId, fileKey)
     → if output too large: get_metadata first, then get_design_context on individual child nodes
  2. Review reference code + screenshot
  3. Adapt to CSS conventions (plain CSS, itss- prefix, BEM)
  4. Write src/components/<Name>/<Name>.tsx + <Name>.css
  5. Update src/main.tsx to include the component
User: npm run dev  →  preview in browser
```

No Figma token management, no intermediate JSON, no templates. The MCP call replaces
the entire extract → spec → generate pipeline.

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server for browser preview |
| `node scripts/export-icons.mjs --token TOKEN` | Export all icons from Figma → `src/icons/*.svg` |

---

## Project Structure

```
supermega-design-system/
├─ CLAUDE.md
├─ package.json
├─ vite.config.ts             ← react() + svgr() plugins
├─ tsconfig.json
├─ index.html                 ← Vite entry (loads src/main.tsx)
├─ scripts/
│  └─ export-icons.mjs        ← auto-discovers icons from Figma tree
└─ src/
   ├─ main.tsx                ← preview entry; Foundations → Components → Atoms
   ├─ preview.css             ← preview page layout styles only
   ├─ tokens.css              ← all design tokens as CSS custom properties
   ├─ vite-env.d.ts           ← /// <reference types="vite-plugin-svgr/client" />
   ├─ icons/                  ← SVG icons (exported by export-icons.mjs)
   │  └─ {name}-{size}.svg    ← e.g. edit-16.svg, chevron-right-12.svg
   │  └─ {name}-scalable.svg  ← scalable variants (48×48 display)
   ├─ logos/                  ← SVG logos (manually exported from Figma)
   │  └─ *.svg
   └─ components/
      ├─ Icon/Icon.tsx         ← Icon + ScalableIcon + helper fns
      ├─ StateLayer/StateLayer.tsx
      ├─ Logo/Logo.tsx         ← factory pattern, named logo exports
      ├─ Spinner/Spinner.tsx
      ├─ Button/CtaButton.tsx
      ├─ DestructiveButton/DestructiveButton.tsx
      ├─ LinkButton/LinkButton.tsx
      └─ <ComponentName>/<ComponentName>.tsx + .css
```

---

## CSS Conventions

- Class prefix: `itss-` for all component classes
- BEM modifier pattern: `itss-cta-btn--primary`, `itss-cta-btn--large`
- Token names: `--bg-*`, `--fg-*`, `--border-*`, `--shadow-*`, `--radius-*`, `--state-*`
- Dark mode: `data-dark="true"` attribute on a wrapper element
- No Tailwind, no CSS-in-JS — plain CSS files co-located with components
- **Component names match Figma exactly** — e.g. "CTA Button" → `CtaButton`, not `Button`

---

## Token Extraction (get_variable_defs)

Light values go in `:root { }`, dark values in `[data-dark="true"] { }`.

**Letter-spacing gotcha:** Figma reports tracking in **percent** (e.g. `-2`, `5`).
Convert to `em`: `-2` → `-0.02em`, `5` → `0.05em`. Never use `px` for letter-spacing.

**Spacing tokens:** Scale is 4px-based (`n × 4 = px`).
CSS vars: `--spacing-{type}-{n}`. **Check for new spacing tokens when implementing each component**
— Figma reference code will reveal any missing from `tokens.css`.

**Dark mode inverse wrapper:** When showing inverse-colored components on a dark background
for preview purposes, do NOT put `data-dark="true"` on the wrapper. Use a CSS background
(`var(--bg-strong)`) only — keeping light mode tokens active so `--fg-on-inverse` = white.

---

## SVG / Icon Infrastructure

### vite-plugin-svgr
- Configured in `vite.config.ts` — import SVGs as React components via `?react` suffix
- Type declarations in `src/vite-env.d.ts`

### import.meta.glob pattern (Icon component)
```ts
const modules = import.meta.glob<{ default: React.FC<React.SVGProps<SVGSVGElement>> }>(
  '../../icons/*.svg',
  { query: '?react', eager: true }
)
```

### Icon naming conventions
- Fixed-size icons: `{name}-{size}.svg` → e.g. `edit-16.svg`, `arrow-up-24.svg`
- Scalable icons: `{name}-scalable.svg` → e.g. `rocket-scalable.svg` (displayed at 48×48)
- Icon names are lowercase with hyphens; sizes are `12 | 16 | 20 | 24`

---

## Component Patterns

### Large frame workflow
When `get_design_context` output is too large (>100KB):
1. Call `get_metadata(nodeId)` to get all child node IDs and names
2. Call `get_design_context` on individual variant nodes (e.g. default large per style)
3. Compare variants to identify color/sizing differences — don't pull every state

### Loading state pattern
**Do NOT use the `disabled` HTML attribute for loading** — it triggers `:disabled` CSS and grays
out the button. Use `pointer-events: none` via the loading class instead.

### CSS :hover over JS state
Prefer CSS `:hover` for interactive-on-hover behaviors (tooltips, state layers, reveal patterns).
Only use React state when the interaction requires persistence beyond the hover.

### Duplicate-structure components
When a component shares identical structure with an existing one, create a **new self-contained
component** with its own CSS file. Do not import or extend another component's CSS.

### Non-submit buttons
Always add `type="button"` to `<button>` elements that are not form submits.

### Logo (factory pattern)
```tsx
function makeLogoComponent(Svg) {
  return function LogoComponent({ className, width, height }) { ... }
}
export const PortalLogo = makeLogoComponent(PortalLogoSvg)
```
Logos are imported as React components via `?react` suffix — no expiring Figma asset URLs.

---

## Preview Organization (src/main.tsx)

Three top-level sections using `.preview-group`:

1. **Foundations** — Logos, Icons (6 categories + Scalable), State Layer
2. **Components** — composed components (CtaButton, DestructiveButton, LinkButton, etc.)
3. **Atoms** — single-purpose primitives (Spinner, etc.)

---

## MCP Tool Reference

| Tool | When to use |
|------|------------|
| `get_variable_defs(nodeId, fileKey)` | Extract design tokens (call for light + dark separately) |
| `get_design_context(nodeId, fileKey)` | Implement a component — returns reference code + screenshot |
| `get_screenshot(nodeId, fileKey)` | Visual inspection when reference code isn't needed |
| `get_metadata(nodeId, fileKey)` | Get child node IDs when frame is too large for get_design_context |

**Large frame strategy:** Call `get_metadata` on the parent frame → get child node IDs →
call `get_design_context` on one representative node per variant. Don't pull every state.
