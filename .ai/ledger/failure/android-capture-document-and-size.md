---
kind: failure
id: android-capture-document-and-size
title: Real device tests exposed reload and viewport setup assumptions
occurrences:
  - 2026-10-06 (run 37497094011)
sources:
  - self-report
---

# Real device tests exposed reload and viewport setup assumptions

**Seen 1 time(s):** 2026-10-06 (run 37497094011)

## Symptom

Android35 launched the app; origin/destination case passed. Mission test failed immediate dialog-open assertion after reload/click, and capture expected viewport1920 but measured1776. No screenshots were produced.

## Trigger

First accelerated real WebView run, previously only test compilation was proven.

## Root Cause

Test could accept the previous document's selector before reload finished; sizing used getRealSize instead of the actual wm override. These diagnoses require confirmation by the retry, not inferred acceptance.

## Fix

Mark the old document, await a newly loaded ready document at both reloads; resize by current shell wm size and measured WebView delta. Retain all behavioural/exact-size assertions. Record logcat/display before image pull so failures still carry diagnostics.
