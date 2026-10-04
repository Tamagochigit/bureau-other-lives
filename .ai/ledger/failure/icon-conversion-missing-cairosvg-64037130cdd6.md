---
kind: failure
id: icon-conversion-missing-cairosvg-64037130cdd6
title: Icon conversion missing CairoSVG
occurrences:
  - 2026-10-04 (observed local command)
sources:
  - observed local command
---

# Icon conversion missing CairoSVG

**Seen 1 time(s):** 2026-10-04 (observed local command)

## Symptom

System Python cannot import cairosvg

## Trigger

One-time conversion of geometric SVG to PNG

## Root Cause

Optional renderer not installed in this environment

## Fix

Generated simple geometric PNG icons with installed Pillow

## Rule Decision

No new invariant because this optional conversion is not runtime behaviour

## Verification

PNG generation command exited zero
