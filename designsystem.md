# SecureGate — Design System

## Foundation

This system is built on **Material Design 3** with Inter as the type family. All values are expressed as CSS custom properties in `tokens.css` — the single source of truth for the entire UI.

**Rule:** Components only consume token variables. No magic numbers, no hardcoded hex values, no inline `font-size: 14px`.

---

## Typography

### Typeface
- **Font:** Inter (Google Fonts)
- **Fallback stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- **Weights used:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Type Scale (Material 3)

All sizes use `clamp(min, preferred, max)` for fluid responsiveness across viewport widths. The preferred value uses `vw`-based interpolation between the min (mobile) and max (desktop) sizes.

| Role | Token | Size (clamp) | Line Height | Weight | Letter Spacing |
|------|-------|------|-------------|--------|----------------|
| Display Large | `--md-sys-typescale-display-large` | clamp(3rem, 5vw, 3.5625rem) | 1.12 | 400 | -0.015625em |
| Display Medium | `--md-sys-typescale-display-medium` | clamp(2.5rem, 4vw, 2.8125rem) | 1.16 | 400 | 0 |
| Display Small | `--md-sys-typescale-display-small` | clamp(2rem, 3.5vw, 2.25rem) | 1.22 | 400 | 0 |
| Headline Large | `--md-sys-typescale-headline-large` | clamp(1.75rem, 3vw, 2rem) | 1.25 | 400 | 0 |
| Headline Medium | `--md-sys-typescale-headline-medium` | clamp(1.5rem, 2.5vw, 1.75rem) | 1.29 | 400 | 0 |
| Headline Small | `--md-sys-typescale-headline-small` | clamp(1.25rem, 2vw, 1.5rem) | 1.33 | 400 | 0 |
| Title Large | `--md-sys-typescale-title-large` | clamp(1.125rem, 1.8vw, 1.375rem) | 1.27 | 400 | 0 |
| Title Medium | `--md-sys-typescale-title-medium` | clamp(1rem, 1.5vw, 1rem) | 1.5 | 500 | +0.009375em |
| Title Small | `--md-sys-typescale-title-small` | clamp(0.875rem, 1.2vw, 0.875rem) | 1.43 | 500 | +0.00625em |
| Label Large | `--md-sys-typescale-label-large` | clamp(0.875rem, 1.1vw, 0.875rem) | 1.43 | 500 | +0.00625em |
| Label Medium | `--md-sys-typescale-label-medium` | clamp(0.75rem, 1vw, 0.75rem) | 1.33 | 500 | +0.03125em |
| Label Small | `--md-sys-typescale-label-small` | clamp(0.6875rem, 0.9vw, 0.6875rem) | 1.45 | 500 | +0.03125em |
| Body Large | `--md-sys-typescale-body-large` | clamp(0.9375rem, 1.3vw, 1rem) | 1.5 | 400 | +0.03125em |
| Body Medium | `--md-sys-typescale-body-medium` | clamp(0.8125rem, 1.1vw, 0.875rem) | 1.43 | 400 | +0.015625em |
| Body Small | `--md-sys-typescale-body-small` | clamp(0.6875rem, 0.9vw, 0.75rem) | 1.33 | 400 | +0.025em |

### Typography Usage Map

| UI Element | Token |
|------------|-------|
| Page title (auth card) | `headline-large` |
| Section headings | `headline-small` |
| Form field labels | `label-large` |
| Input text | `body-large` |
| Helper / error text | `body-small` |
| Button text | `label-large` |
| Navigation links | `label-medium` |
| Badge / chip text | `label-small` |

---

## Color

See [colorstyle.md](./colorstyle.md) for full tonal palette reference.

### Quick Reference — Component Color Mapping

| Component | Background | Text | Border |
|-----------|-----------|------|--------|
| Page background | `--md-sys-color-background` | `--md-sys-color-on-background` | — |
| Auth card | `--md-sys-color-surface` | `--md-sys-color-on-surface` | — |
| Input (default) | `--md-sys-color-surface-variant` | `--md-sys-color-on-surface-variant` | `--md-sys-color-outline` |
| Input (focused) | `--md-sys-color-surface-variant` | `--md-sys-color-on-surface` | `--md-sys-color-primary` |
| Input (error) | `--md-sys-color-surface-variant` | `--md-sys-color-on-surface` | `--md-sys-color-error` |
| Primary button | `--md-sys-color-primary` | `--md-sys-color-on-primary` | — |
| Primary button (hover) | `--md-sys-color-primary` + 8% white overlay | `--md-sys-color-on-primary` | — |
| Secondary button | transparent | `--md-sys-color-primary` | `--md-sys-color-outline` |
| Error banner | `--md-sys-color-error-container` | `--md-sys-color-on-error-container` | — |
| Success banner | `--color-role-success-container` | `--color-role-on-success` | — |
| Warning banner | `--color-role-warning-container` | `--color-role-on-warning` | — |

---

## Spacing

An 8-point base grid. All spacing tokens are multiples of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon padding, tight gaps |
| `--space-2` | 8px | Input internal padding (vertical) |
| `--space-3` | 12px | Small component gaps |
| `--space-4` | 16px | Default internal padding, form field gap |
| `--space-5` | 20px | Card section spacing |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Between form groups |
| `--space-10` | 40px | Section spacing |
| `--space-12` | 48px | Large vertical rhythm |
| `--space-16` | 64px | Page-level spacing |
| `--space-20` | 80px | Hero / marketing spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Chips, small badges |
| `--radius-sm` | 8px | Inputs, small cards |
| `--radius-md` | 12px | Buttons |
| `--radius-lg` | 16px | Cards, modals |
| `--radius-xl` | 24px | Large surfaces |
| `--radius-full` | 9999px | Pills, avatar circles |

---

## Elevation (Shadow)

Material 3 elevation expressed as box-shadow. Uses `--md-sys-color-shadow` (black) at varying opacities.

| Token | Level | CSS | Usage |
|-------|-------|-----|-------|
| `--elevation-0` | 0 | none | Flat surfaces |
| `--elevation-1` | 1 | `0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)` | Cards (resting) |
| `--elevation-2` | 2 | `0 1px 2px rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)` | Cards (hover) |
| `--elevation-3` | 3 | `0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.3)` | Dialogs, dropdowns |
| `--elevation-4` | 4 | `0 6px 10px 4px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.3)` | Navigation drawer |
| `--elevation-5` | 5 | `0 8px 12px 6px rgba(0,0,0,.15), 0 4px 4px rgba(0,0,0,.3)` | Modals |

---

## Motion & Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-short-1` | 50ms | Ripple start |
| `--duration-short-2` | 100ms | Icon morph |
| `--duration-short-3` | 150ms | Fade in/out (small) |
| `--duration-short-4` | 200ms | Input border color |
| `--duration-medium-1` | 250ms | Button state change |
| `--duration-medium-2` | 300ms | Card expand |
| `--duration-medium-3` | 350ms | Page transition (element) |
| `--duration-medium-4` | 400ms | Page transition (full) |
| `--duration-long-1` | 450ms | Complex layout shift |
| `--easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | General movement |
| `--easing-standard-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Elements entering |
| `--easing-standard-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Elements exiting |
| `--easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | High-attention transitions |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-below` | -1 | Behind base layer |
| `--z-base` | 0 | Normal document flow |
| `--z-raised` | 10 | Sticky inputs, raised cards |
| `--z-dropdown` | 100 | Select menus, autocomplete |
| `--z-sticky` | 200 | Sticky headers |
| `--z-overlay` | 300 | Overlays, backdrops |
| `--z-modal` | 400 | Dialogs, modals |
| `--z-toast` | 500 | Toast notifications |
| `--z-tooltip` | 600 | Tooltips |

---

## Component Specs

### Auth Card
- Max width: 440px
- Padding: `--space-6` (24px) — mobile; `--space-8` (32px) — tablet+
- Border radius: `--radius-lg` (16px)
- Background: `--md-sys-color-surface`
- Elevation: `--elevation-1` (resting)
- Centered on page with `--md-sys-color-background` behind

### Text Input
- Height: 56px
- Border: 1px solid `--md-sys-color-outline`
- Border radius: `--radius-sm` (8px)
- Focus: 2px solid `--md-sys-color-primary`
- Error: 2px solid `--md-sys-color-error`
- Label: floats above on focus/fill (`label-small` when active, `body-large` when empty)
- Helper text below: `--md-sys-typescale-body-small`, `--md-sys-color-on-surface-variant`

### Primary Button
- Height: 40px
- Padding: 24px horizontal
- Border radius: `--radius-md` (12px)
- Background: `--md-sys-color-primary`
- Text: `--md-sys-color-on-primary`, `label-large`
- Loading state: spinner replaces text, button disabled

### Password Strength Indicator
- 3-segment bar below password field
- Weak: 1 segment, `--color-role-strength-weak`
- Fair: 2 segments, `--color-role-strength-fair`
- Strong: 3 segments, `--color-role-strength-strong`
- Label text uses corresponding color role

---

## Responsive Breakpoints

| Token | Value | Applies to |
|-------|-------|-----------|
| `--bp-sm` | 640px | Small devices (landscape phone) |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small desktops |
| `--bp-xl` | 1280px | Large desktops |

Auth pages use a single-column centered layout on all breakpoints. The card width grows from 100% (mobile padding) to max 440px (tablet+).

---

## Accessibility Checklist

- [ ] All form inputs have associated `<label>` elements
- [ ] Error messages are linked via `aria-describedby`
- [ ] Buttons have `aria-busy="true"` during loading
- [ ] Color contrast meets WCAG AA (4.5:1 minimum for normal text)
- [ ] Focus visible on all interactive elements
- [ ] Password strength conveyed via text label, not color alone
- [ ] Toast/alerts use `role="alert"` for screen reader announcements
