---
kind: failure
id: android-ci-removed-tools
title: Android CI requested a removed SDK package
occurrences:
  - 2026-10-05 (GitHub run 37373681294)
sources:
  - self-report
---

# Android CI requested a removed SDK package

**Seen 1 time(s):** 2026-10-05 (GitHub run 37373681294)

## Symptom

SDK setup failed with Failed to find package tools; compile/lint steps were skipped.

## Trigger

setup-android v3 still defaults to tools platform-tools on a fresh runner.

## Root Cause

Google no longer serves the deprecated tools package; command-line tools are installed separately by the action.

## Fix

Explicitly request platform-tools only. Preserve assembly/lint and observe a fresh CI run separately; the existing signed APK is unchanged.
