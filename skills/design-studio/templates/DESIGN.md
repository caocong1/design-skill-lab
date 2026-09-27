---
version: alpha
name: <System name>
description: <One sentence on what this system is for.>
colors:
  surface: "#FAFAFA"
  surface-raised: "#FFFFFF"
  on-surface: "#1A1A1A"
  muted: "#5C5C5C"
  outline: "#8A8A8A"
  primary: "#4D4D4D"
  on-primary: "#FFFFFF"
  error: "#A3261E"
  on-error: "#FFFFFF"
typography:
  display:
    fontFamily: system-ui
    fontSize: 40px
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: -0.4px
  title:
    fontFamily: system-ui
    fontSize: 20px
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: 0px
  body-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: 0px
  label-md:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 500
    lineHeight: "1.3"
    letterSpacing: 0px
rounded:
  none: 0px
  control: 2px
  container: 6px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.control}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.on-surface}"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.control}"
    padding: 8px
  input-helper:
    textColor: "{colors.muted}"
    typography: "{typography.label-md}"
---

<!-- Template: copy the structure, not the values. Every token value above is a placeholder
     (achromatic, system font) to be replaced from the chosen direction; tokens.css implements the
     same roles. Write or update this file from what was actually built, then lint it if the
     DESIGN.md CLI is available. The first eight sections follow the DESIGN.md spec order; the rest
     are extra sections, which consumers preserve. Every typography level keeps all five properties,
     written as references/process/system.md says, so the DTCG export stays valid. Delete these
     comments. -->

# <System name>

## Overview

<Personality in two or three sentences, the audience and scene (from PRODUCT.md), the visitor mode
of the main surfaces, and the one memorable idea every screen carries.>

## Colors

<Colour strategy (restrained / committed / full palette / drenched) and what each role is for.
Frequency budget, e.g. "surfaces ~70%, text and outlines ~25%, primary under 5% and only on the one
main action per view". Status colours always pair with a second cue.>

## Typography

<Families and why they were chosen, the role of each style, CJK stack and mixed-script rules,
numerals (tabular in tables), the smallest size allowed and where.>

## Layout

<Grid or margin model per window class, how the spacing scale is used (inset, stack, section),
density modes, maximum content width.>

## Elevation & Depth

<Levels and how each is drawn in light and in dark (lighter surfaces, not shadows, in dark).
System materials by role (for example functional-layer glass is drawn by the platform).>

## Shapes

<Radius logic: which elements get which step, which shape type nested elements take
(fundamentals/layout-and-spacing.md > Shape and radius); border widths.>

## Components

<Per component: purpose and when not to use it, anatomy, variants, states (default, hover,
focus-visible, pressed, selected, loading, disabled, invalid), behaviour (keyboard map, the ARIA
pattern it follows), tokens used.>

## Do's and Don'ts

- Do <a rule a reviewer can check on a screenshot>
- Don't <...>

## Motion

<Personality in one line, duration or spring tokens, what never animates (actions repeated many
times a day), reduced-motion behaviour.>

## Modes and themes

<Light, dark, high contrast; theme families and their declared variant points; where the resolver
or per-mode files live.>

## Contrast

| Foreground | Background | Mode | Ratio | Use |
| --- | --- | --- | --- | --- |
| on-surface | surface | light | <computed> | body text |

<Generated with color_tools.py; never estimated.>

## Not covered

<What this system deliberately does not decide yet.>
