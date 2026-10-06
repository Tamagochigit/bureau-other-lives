---
kind: failure
id: store-capture-scroll-offset
title: Store capture assumed every content anchor could align at a fixed offset
occurrences:
  - 2026-10-06 (run 37502172883)
sources:
  - self-report
---

# Store capture assumed every content anchor could align at a fixed offset

## Symptom

Android35 release/lint and both offline cases passed. Four PNGs and icon were exported. Catalog/diary visual review confirmed real scrolled cards and no toast. Compass capture stopped at the new setup assertion requiring its grid top to equal16px; no fifth PNG or successful run was claimed.

## Trigger

Ordinary scrolling introduced to expose content in store screenshots.

## Root Cause

The setup asserted an arbitrary16px anchor rather than the reachable browser position and visible content. The failed run lacked scroll range/position metrics, so clamping versus late hash-navigation scrolling is not yet confirmed.

## Fix

Calculate the desired position inside the real document scroll range; bound retries and require two stable samples plus visible content. Emit desired/current/top/height/max metrics. Preserve all offline behaviour and exact1080x1920 capture assertions and five-image gate. A new run and visual review must confirm the correction.

## Verified Resolution

Run37503405295/sourcee443376 passed all three Android35 cases at36.896s and exported five PNGs plus icon. Artifact11430573312 ZIP SHA256165eedf675eddb6215d9edcac364dc458ae2adae1730bad65e8e5a7dbdcf8e50 independently verified. All final images inspected: diary example and two compass scores are visible, no toast. Compass desired492.177/max1336 was reachable; initial y246.667 is consistent with scrolling still in flight. This supports a race inference, not a retrospective proof of the prior failure. Bounded stable-position/content-visible checks succeeded.
