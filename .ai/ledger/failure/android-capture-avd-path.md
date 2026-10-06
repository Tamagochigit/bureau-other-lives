---
kind: failure
id: android-capture-avd-path
title: Android capture could not find the created AVD
occurrences:
  - 2026-10-06 (run 37495734206)
sources:
  - self-report
---

# Android capture could not find the created AVD

**Seen 1 time(s):** 2026-10-06 (run 37495734206)

## Symptom

Release/lint/debug/test APK builds succeeded, but emulator reported Unknown AVD name BureauStore; wait-for-device timed out (124). No instrumentation test or screenshot ran.

## Trigger

Fresh runner with avdmanager and emulator resolving different default configuration directories.

## Root Cause

Capture relied on each tool's default AVD path instead of an explicit shared location.

## Fix

Use task-scoped ANDROID_AVD_HOME and explicit create --path; check the generated INI and emulator list before starting. Copy unsigned/source evidence before launch and upload release even if device stage fails. Keep native acceptance checks intact; observe the retry separately.
