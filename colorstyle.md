# SecureGate — Color Style Guide (Material 3)

## System Overview

The color system follows Material Design 3's tonal palette architecture. Every color in the UI is derived from one of six **key colors** (Primary, Secondary, Tertiary, Error, Neutral, Neutral Variant). Each key color generates a full tonal palette (0–100), and specific tones are assigned to **color roles** that are the only values used in components.

**Never use primitive palette values directly in components. Always reference color roles.**

---

## Key Color Rationale

| Role | Key Color | Hex | Reasoning |
|------|-----------|-----|-----------|
| Primary | Blue | `#1A56DB` | Trust, authority, reliability — the primary action color on all auth CTAs |
| Secondary | Slate | `#5D5E72` | Supporting text, secondary actions, subdued UI elements |
| Tertiary | Teal | `#006A6A` | Success states, verified badge, positive feedback |
| Error | Red | `#BA1A1A` | Validation errors, failed auth, destructive states |
| Neutral | Cool Gray | `#5E5E62` | Surfaces, backgrounds, body text |
| Neutral Variant | Slate Gray | `#5E5D67` | Surface variants, input borders, dividers |

---

## Tonal Palettes (Primitives)

Tones range from 0 (black) to 100 (white). The number represents perceived lightness.

### Primary Palette — Blue

| Token | Tone | Hex |
|-------|------|-----|
| `--color-primary-0` | 0 | `#000000` |
| `--color-primary-10` | 10 | `#00105C` |
| `--color-primary-20` | 20 | `#001E8C` |
| `--color-primary-30` | 30 | `#002EBF` |
| `--color-primary-40` | 40 | `#1A56DB` |
| `--color-primary-50` | 50 | `#4071F5` |
| `--color-primary-60` | 60 | `#6B8EFF` |
| `--color-primary-70` | 70 | `#98ABFF` |
| `--color-primary-80` | 80 | `#BEC6FF` |
| `--color-primary-90` | 90 | `#DFE0FF` |
| `--color-primary-95` | 95 | `#F0EEFF` |
| `--color-primary-99` | 99 | `#FAFBFF` |
| `--color-primary-100` | 100 | `#FFFFFF` |

### Secondary Palette — Slate

| Token | Tone | Hex |
|-------|------|-----|
| `--color-secondary-0` | 0 | `#000000` |
| `--color-secondary-10` | 10 | `#191A2C` |
| `--color-secondary-20` | 20 | `#2E2F42` |
| `--color-secondary-30` | 30 | `#454658` |
| `--color-secondary-40` | 40 | `#5D5E72` |
| `--color-secondary-50` | 50 | `#76778B` |
| `--color-secondary-60` | 60 | `#9091A6` |
| `--color-secondary-70` | 70 | `#ABABC1` |
| `--color-secondary-80` | 80 | `#C7C6DC` |
| `--color-secondary-90` | 90 | `#E3E1F9` |
| `--color-secondary-95` | 95 | `#F1EFFF` |
| `--color-secondary-99` | 99 | `#FAFBFF` |
| `--color-secondary-100` | 100 | `#FFFFFF` |

### Tertiary Palette — Teal

| Token | Tone | Hex |
|-------|------|-----|
| `--color-tertiary-0` | 0 | `#000000` |
| `--color-tertiary-10` | 10 | `#002020` |
| `--color-tertiary-20` | 20 | `#003737` |
| `--color-tertiary-30` | 30 | `#004F4F` |
| `--color-tertiary-40` | 40 | `#006A6A` |
| `--color-tertiary-50` | 50 | `#008585` |
| `--color-tertiary-60` | 60 | `#00A1A1` |
| `--color-tertiary-70` | 70 | `#00BDBD` |
| `--color-tertiary-80` | 80 | `#00D9D9` |
| `--color-tertiary-90` | 90 | `#9CF1F1` |
| `--color-tertiary-95` | 95 | `#CFF8F8` |
| `--color-tertiary-99` | 99 | `#F0FEFF` |
| `--color-tertiary-100` | 100 | `#FFFFFF` |

### Error Palette — Red

| Token | Tone | Hex |
|-------|------|-----|
| `--color-error-0` | 0 | `#000000` |
| `--color-error-10` | 10 | `#410002` |
| `--color-error-20` | 20 | `#690005` |
| `--color-error-30` | 30 | `#93000A` |
| `--color-error-40` | 40 | `#BA1A1A` |
| `--color-error-50` | 50 | `#DE3730` |
| `--color-error-60` | 60 | `#FF5449` |
| `--color-error-70` | 70 | `#FF897D` |
| `--color-error-80` | 80 | `#FFB4AB` |
| `--color-error-90` | 90 | `#FFDAD6` |
| `--color-error-95` | 95 | `#FFEDEA` |
| `--color-error-99` | 99 | `#FFFBFF` |
| `--color-error-100` | 100 | `#FFFFFF` |

### Neutral Palette — Cool Gray

| Token | Tone | Hex |
|-------|------|-----|
| `--color-neutral-0` | 0 | `#000000` |
| `--color-neutral-10` | 10 | `#1B1B1F` |
| `--color-neutral-20` | 20 | `#303034` |
| `--color-neutral-30` | 30 | `#47474B` |
| `--color-neutral-40` | 40 | `#5E5E62` |
| `--color-neutral-50` | 50 | `#77767A` |
| `--color-neutral-60` | 60 | `#919094` |
| `--color-neutral-70` | 70 | `#ACAAB0` |
| `--color-neutral-80` | 80 | `#C8C6CA` |
| `--color-neutral-90` | 90 | `#E4E1E6` |
| `--color-neutral-95` | 95 | `#F2EFF4` |
| `--color-neutral-99` | 99 | `#FFFBFF` |
| `--color-neutral-100` | 100 | `#FFFFFF` |

### Neutral Variant Palette — Slate Gray

| Token | Tone | Hex |
|-------|------|-----|
| `--color-neutral-variant-0` | 0 | `#000000` |
| `--color-neutral-variant-10` | 10 | `#1B1B23` |
| `--color-neutral-variant-20` | 20 | `#303038` |
| `--color-neutral-variant-30` | 30 | `#46464F` |
| `--color-neutral-variant-40` | 40 | `#5E5D67` |
| `--color-neutral-variant-50` | 50 | `#777680` |
| `--color-neutral-variant-60` | 60 | `#918F9A` |
| `--color-neutral-variant-70` | 70 | `#ACAAB4` |
| `--color-neutral-variant-80` | 80 | `#C8C5D0` |
| `--color-neutral-variant-90` | 90 | `#E4E1EC` |
| `--color-neutral-variant-95` | 95 | `#F3EFFE` |
| `--color-neutral-variant-99` | 99 | `#FFFBFF` |
| `--color-neutral-variant-100` | 100 | `#FFFFFF` |

---

## Color Roles

Color roles are the **only tokens referenced in component code**. They map semantic meaning to tonal palette values, and swap automatically between light and dark themes.

### Light Theme Roles

| Role | Value | Primitive |
|------|-------|-----------|
| `--md-sys-color-primary` | `#1A56DB` | Primary/40 |
| `--md-sys-color-on-primary` | `#FFFFFF` | Primary/100 |
| `--md-sys-color-primary-container` | `#DFE0FF` | Primary/90 |
| `--md-sys-color-on-primary-container` | `#00105C` | Primary/10 |
| `--md-sys-color-secondary` | `#5D5E72` | Secondary/40 |
| `--md-sys-color-on-secondary` | `#FFFFFF` | Secondary/100 |
| `--md-sys-color-secondary-container` | `#E3E1F9` | Secondary/90 |
| `--md-sys-color-on-secondary-container` | `#191A2C` | Secondary/10 |
| `--md-sys-color-tertiary` | `#006A6A` | Tertiary/40 |
| `--md-sys-color-on-tertiary` | `#FFFFFF` | Tertiary/100 |
| `--md-sys-color-tertiary-container` | `#9CF1F1` | Tertiary/90 |
| `--md-sys-color-on-tertiary-container` | `#002020` | Tertiary/10 |
| `--md-sys-color-error` | `#BA1A1A` | Error/40 |
| `--md-sys-color-on-error` | `#FFFFFF` | Error/100 |
| `--md-sys-color-error-container` | `#FFDAD6` | Error/90 |
| `--md-sys-color-on-error-container` | `#410002` | Error/10 |
| `--md-sys-color-background` | `#FFFBFF` | Neutral/99 |
| `--md-sys-color-on-background` | `#1B1B1F` | Neutral/10 |
| `--md-sys-color-surface` | `#FFFBFF` | Neutral/99 |
| `--md-sys-color-on-surface` | `#1B1B1F` | Neutral/10 |
| `--md-sys-color-surface-variant` | `#E4E1EC` | Neutral Variant/90 |
| `--md-sys-color-on-surface-variant` | `#46464F` | Neutral Variant/30 |
| `--md-sys-color-outline` | `#777680` | Neutral Variant/50 |
| `--md-sys-color-outline-variant` | `#C8C5D0` | Neutral Variant/80 |
| `--md-sys-color-inverse-surface` | `#303034` | Neutral/20 |
| `--md-sys-color-inverse-on-surface` | `#F2EFF4` | Neutral/95 |
| `--md-sys-color-inverse-primary` | `#BEC6FF` | Primary/80 |
| `--md-sys-color-scrim` | `#000000` | Neutral/0 |
| `--md-sys-color-shadow` | `#000000` | Neutral/0 |

### Dark Theme Roles

| Role | Value | Primitive |
|------|-------|-----------|
| `--md-sys-color-primary` | `#BEC6FF` | Primary/80 |
| `--md-sys-color-on-primary` | `#001E8C` | Primary/20 |
| `--md-sys-color-primary-container` | `#002EBF` | Primary/30 |
| `--md-sys-color-on-primary-container` | `#DFE0FF` | Primary/90 |
| `--md-sys-color-secondary` | `#C7C6DC` | Secondary/80 |
| `--md-sys-color-on-secondary` | `#2E2F42` | Secondary/20 |
| `--md-sys-color-secondary-container` | `#454658` | Secondary/30 |
| `--md-sys-color-on-secondary-container` | `#E3E1F9` | Secondary/90 |
| `--md-sys-color-tertiary` | `#00D9D9` | Tertiary/80 |
| `--md-sys-color-on-tertiary` | `#003737` | Tertiary/20 |
| `--md-sys-color-tertiary-container` | `#004F4F` | Tertiary/30 |
| `--md-sys-color-on-tertiary-container` | `#9CF1F1` | Tertiary/90 |
| `--md-sys-color-error` | `#FFB4AB` | Error/80 |
| `--md-sys-color-on-error` | `#690005` | Error/20 |
| `--md-sys-color-error-container` | `#93000A` | Error/30 |
| `--md-sys-color-on-error-container` | `#FFDAD6` | Error/90 |
| `--md-sys-color-background` | `#1B1B1F` | Neutral/10 |
| `--md-sys-color-on-background` | `#E4E1E6` | Neutral/90 |
| `--md-sys-color-surface` | `#1B1B1F` | Neutral/10 |
| `--md-sys-color-on-surface` | `#E4E1E6` | Neutral/90 |
| `--md-sys-color-surface-variant` | `#46464F` | Neutral Variant/30 |
| `--md-sys-color-on-surface-variant` | `#C8C5D0` | Neutral Variant/80 |
| `--md-sys-color-outline` | `#918F9A` | Neutral Variant/60 |
| `--md-sys-color-outline-variant` | `#46464F` | Neutral Variant/30 |
| `--md-sys-color-inverse-surface` | `#E4E1E6` | Neutral/90 |
| `--md-sys-color-inverse-on-surface` | `#303034` | Neutral/20 |
| `--md-sys-color-inverse-primary` | `#1A56DB` | Primary/40 |
| `--md-sys-color-scrim` | `#000000` | Neutral/0 |
| `--md-sys-color-shadow` | `#000000` | Neutral/0 |

---

## Extended Semantic Roles (App-specific)

These additional roles map to Material 3 primitives but serve specific SecureGate UI needs:

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| `--color-role-success` | Tertiary/40 `#006A6A` | Tertiary/80 `#00D9D9` | Email verified, password match |
| `--color-role-on-success` | Tertiary/100 `#FFFFFF` | Tertiary/20 `#003737` | Text on success backgrounds |
| `--color-role-success-container` | Tertiary/90 `#9CF1F1` | Tertiary/30 `#004F4F` | Success banners |
| `--color-role-warning` | `#7A5900` | `#F0BF35` | Expiring token, weak password |
| `--color-role-on-warning` | `#FFFFFF` | `#3E2E00` | Text on warning surfaces |
| `--color-role-warning-container` | `#FDEFC3` | `#574100` | Warning banners |
| `--color-role-strength-weak` | Error/40 `#BA1A1A` | Error/80 `#FFB4AB` | Password strength: weak |
| `--color-role-strength-fair` | `#7A5900` | `#F0BF35` | Password strength: fair |
| `--color-role-strength-strong` | Tertiary/40 `#006A6A` | Tertiary/80 `#00D9D9` | Password strength: strong |

---

## Usage Rules

1. **Always reference color roles** — never use raw palette primitives in CSS class declarations
2. **Contrast minimum:** All text/background combinations must meet WCAG AA (4.5:1 normal text, 3:1 large)
3. **Error states:** Use color + supporting icon + text — never rely on color alone
4. **Focus rings:** Use `--md-sys-color-primary` at 2px offset, 2px width
5. **Disabled states:** 38% opacity on `--md-sys-color-on-surface` for text, 12% for containers
