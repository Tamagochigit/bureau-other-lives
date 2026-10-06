---
kind: failure
id: android-debug-version-assertion
title: Native settings test compared the debug suffix to release UI
occurrences:
  - 2026-10-07 (Moscow, run 37545161654)
sources:
  - self-report
---

# Native settings test compared the debug suffix to release UI

## Symptom

Run37545161654/source24855c588f7b21e27ebcf694adc4e1f01ed5f1fb: release/lint and debug/instrumentation compilation passed. Android35 ran four cases; settings assertion OfflineSmokeTest.java:65 failed, three cases including the bundled public-share chooser boundary and five-image capture passed. Overall native run failed; no full green acceptance is claimed.

## Trigger

Agent /root changed the settings version assertion to BuildConfig.VERSION_NAME in the universal-sharing batch.

## Root Cause

The debug build appends `-debug`; shared settings correctly display the release version0.4.2. Test expected Android0.4.2-debug rather than the product-facing version, confirmed by buildTypes and the exact failure location.

## Fix

Remove only the declared debug suffix when building the expected UI text. Keep the exact release-version assertion, all four native cases, image count, original data/origin and lint gates. No runtime/release code change or test exclusion. A new native CI run must verify the fix.

## Status

pending verification

## Evidence

Capture artifact11450976424 ZIP SHA25685f8f5573dec448ec9e1a8cd9f70aebbd77b48b99eb261137107c90472471c89 independently downloaded/hashed; contains five current PNGs and native diagnostics. Unsigned release is present. Review if debug version suffix or visible version contract changes. This is not permission to weaken version checks.
