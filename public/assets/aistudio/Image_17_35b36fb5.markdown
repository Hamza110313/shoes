---
name: Kinetic Obsidian
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffb4aa'
  on-secondary: '#690003'
  secondary-container: '#c5020b'
  on-secondary-container: '#ffd2cc'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930005'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system translates the raw kinetic precision of elite track-and-field technology into an avant-garde luxury mobile commerce interface. It bridges the tension between technical industrial minimalism and expressive editorial haute couture. Built specifically for mobile-first native and responsive web interactions, the aesthetic projects unapologetic speed, mechanical discipline, and high-fashion exclusivity.

The visual style merges dark-mode architectural minimalism with hyper-tactile, luminescent focal points. Interfaces lean into deep void-like depth punctuated by surgical neon accents, crisp linear borders, and frosted translucent overlays that simulate composite carbon fiber and high-tensile technical polymers. The emotional resonance is uncompromising, premium, and adrenaline-charged.

## Colors

The palette establishes an absolute contrast landscape grounded in ultra-dark depth, engineered to maximize OLED efficiency and render performance footwear silhouettes with dramatic sculptural presence.

- **Primary (`#ccff00` - Electric Volt):** The kinetic pulse of the system. Reserved strictly for primary call-to-actions, active state rings, selected indicator pips, and key data readouts. It must never be applied to large background fields.
- **Secondary (`#ff3b30` - Crimson Flare):** Engineered for critical tension: flash sale badging, urgency countdowns, limited stock warnings, and destructive cart interactions.
- **Tertiary (`#ffffff` - Pure White):** Crisp, structural contrast for primary typography, editorial titling, and high-priority interactive icons.
- **Neutral Core (`#09090b` - Deep Obsidian):** The foundational canvas. Supported by a graded scale of technical slate containers:
  - Surface Foundation: `#09090b`
  - Elevated Container / Card Base: `#18181b`
  - Subtle Border / Division Rules: `#27272a`
  - Secondary Text / Inactive Micro-labels: `#71717a`
  - High-illumination text / Pill fill: `#f4f4f5`

## Typography

The typography couples the architectural flair of Syne with the structural legibility of Plus Jakarta Sans and Inter.

- **Headlines (Syne):** Sculptural, wide, and aggressive. Applied to product drop titles, campaign hooks, and major section breaks. All headline sizing is optimized for rapid mobile scanning without breaking line rhythm.
- **Body Copy (Plus Jakarta Sans):** Ergonomic and modern. Balances high readability across technical spec sheets, engineering breakdowns, and material composition narratives.
- **Labels & Micro-data (Inter):** Systemized, all-caps, tracked letterforms (+0.08em to +0.12em). Used for sizing metrics (US 7 to 13), technical SKU identifiers, filter chips, and interactive states.

## Layout & Spacing

The layout model is anchored in a mobile-first fluid grid optimized for thumb-reach ergonomics and continuous one-handed vertical scrolling:

- **Mobile Viewport (< 640px):** 4-column fluid layout with `1rem` margins and `0.75rem` column gutters. Full-bleed hero carousels with internal safe area margins.
- **Tablet / Expanded Mobile (640px - 1024px):** 8-column layout with `1.25rem` margins and `1rem` gutters. Product cards reflow into a dynamic dual-column asymmetric catalog layout.
- **Component Grid Rhythm:** Vertical stack cadences leverage a strict 8pt base grid (expressed through tokens `space-xs` through `space-xl`). Sticky viewports, including the persistent checkout action bar, account for device home indicator bars (`safe-area-inset-bottom`).

## Elevation & Depth

Spatial layering relies on translucent glassmorphism paired with surgical ghost borders rather than traditional diffused dropshadows.

- **Level 0 (Baseplate):** Deep Obsidian (`#09090b`) pure flat background.
- **Level 1 (Card & Module Layer):** Surface Slate (`#18181b`) bounded by a subtle 1px low-contrast outline in `#27272a`.
- **Level 2 (Floating Controls & Popovers):** Glassmorphic surface composed of `rgba(24, 24, 27, 0.72)` paired with `backdrop-filter: blur(20px)` and a top-edge specular highlight border of `1px solid rgba(255, 255, 255, 0.12)`.
- **Level 3 (Persistent Navigation & Sticky Action Dock):** Heavy structural glass with `rgba(9, 9, 11, 0.88)` and `backdrop-filter: blur(24px)`, creating seamless material separation from scrolling product imagery below.
- **Volt Luminescence:** For active selection indicators and limited-edition tags, a directional ambient rim glow of `0 0 16px rgba(204, 255, 0, 0.25)` may be applied to project self-illumination.

## Shapes

The geometric signature balances structural enclosure with ergonomic pill forms:

- **Cards and Containers:** Feature `1rem` (rounded-lg) to `1.5rem` (rounded-xl / rounded-2xl mobile standard) boundary curves, softening the technical grit and cradling product photography.
- **Interactive Controls & Data Tags:** Full pill geometries (`border-radius: 9999px`) are applied across size selector tags, quick-action CTA buttons, color swatch rings, and sale badges, reinforcing tactile snap and immediate touch affordance.

## Components

### Buttons
- **Primary CTA:** High-voltage button. Background `#ccff00`, text `#09090b` (`label-lg` uppercase, tracking +0.08em), height `56px`, full pill radius. Tap states apply an immediate scale transform of `0.97` without color degradation.
- **Secondary / Ghost:** Outlined pill with `1px solid #27272a`, background `transparent`, text `#ffffff`. Active state swaps background to `#18181b`.
- **Icon Actions:** `44x44px` circular glass pills (`rgba(255, 255, 255, 0.06)`) with `1px solid rgba(255, 255, 255, 0.12)` for wishlist and bag triggers.

### Size Selector Pills
- Rendered in a horizontal snapping carousel. Pill dimensions: min-width `52px`, height `44px`, border-radius `9999px`.
- **Default:** Background `#18181b`, border `1px solid #27272a`, text `#f4f4f5`.
- **Selected:** Background `#ccff00`, border `1px solid #ccff00`, text `#09090b` (bold weight).
- **Disabled / Sold Out:** Strikethrough line, text `#71717a`, background `#09090b`, border `1px dashed #27272a`.

### Product Cards
- Container built with `rounded-2xl` (`1.5rem`), background `#18181b`, border `1px solid #27272a`.
- Visual viewport features an integrated 4:5 vertical product crop over `#121214`.
- Integrated floating badges: Top-left pill tag for status (`#ff3b30` text over `rgba(255, 59, 48, 0.15)` fill), top-right circular wishlist icon button.

### Sticky Bottom Action Dock
- Fixed to mobile viewport bottom, accounting for environmental safe areas.
- Layered with `backdrop-filter: blur(24px)`, background `rgba(9, 9, 11, 0.85)`, and a `1px` top border in `rgba(255, 255, 255, 0.08)`.
- Left slot: Pricing display with Syne bold display font (`headline-md`) and currency descriptor. Right slot: Expansive Primary CTA button with integrated haptic-feedback animation triggers.

### Interactive Swatches & Thumbnails
- Circular `36px` color variant toggles featuring high-resolution shoe colorway textures.
- Selected state: Concentric dual-ring with a `2px` black gap and a `2px #ccff00` primary perimeter ring.

### Form Inputs & Micro-Controls
- **Inputs:** Height `52px`, rounded pill or `rounded-lg`, background `#121214`, border `1px solid #27272a`, text `#ffffff`. Focus changes border to `#ccff00` with zero layout shift.
- **Checkboxes & Radios:** Minimalist mechanical targets (`20x20px`). Radio uses concentric `#ccff00` center fill; checkbox uses sharp vector checkmark in obsidian over electric volt fill.