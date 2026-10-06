---
kind: failure
id: android-capture-document-and-size
title: Real device tests exposed reload and viewport setup assumptions
occurrences:
  - 2026-10-06 (run 37497094011)
  - 2026-10-06 (run 37498592979)
sources:
  - self-report
---

# Real device tests exposed reload and viewport setup assumptions

**Seen 2 time(s):** 2026-10-06 (run 37497094011)

## Symptom

Android35 launched the app; origin/destination case passed. Mission test failed immediate dialog-open assertion after reload/click, and capture expected viewport1920 but measured1776. No screenshots were produced.

## Trigger

First accelerated real WebView run, previously only test compilation was proven.

## Root Cause

Initial selector polling could accept the old document before reload; the fresh-document marker subsequently advanced through mission start. Chromium then proved the unquoted numeric rating selector invalid. The AVD still had physical320×640/actual override1080×1920, so changing window metrics alone did not yield the requested capture height.

## Fix

Retain the old-document marker and behavioural/exact-size assertions. Quote numeric CSS values in both cases; configure physical LCD1080×2064/density480 before boot and reset wm overrides. Keep logcat/display evidence before image pulls. Retry must prove the hardware/setup correction; no successful capture is claimed yet.

## Confirmed Follow-up

Run37498592979 passed dialog opening and mission start after fresh-document synchronisation. Feedback failed because Chromium rejected input[name=rating][value=5] as an invalid numeric CSS selector. Both test selectors now quote their numeric values. Display evidence remained physical320×640/override1080×1920 despite resize requests; window-only resizing was insufficient. Configure real AVD LCD1080×2064/density480 before boot and reset wm overrides. Exact viewport/behaviour assertions are retained. Updated native run must confirm this setup.

## Verified Resolution

Run37500968161/sourceb9e5a7e passed all three Android35 tests at26.24s and produced five RGB1080x1920 PNGs plusRGB512 icon. Artifact11429931649 ZIP SHA256972da7dac8218b63737f7d01a3e63857f2466e2c5181331816521de3659ba67e was independently hashed; measured image dimensions confirm physical LCD correction and quoted selectors. Final image quality follow-up is distinct from this resolved native setup failure.
