---
kind: failure
id: android-portable-build-setup
title: Portable Android build needed current proxy and cgroup workaround
occurrences:
  - 2026-10-05 (self-report)
sources:
  - self-report
---

# Portable Android build needed current proxy and cgroup workaround

**Seen 1 time(s):** 2026-10-05 (self-report)

## Symptom

Initial Android dependency resolution/lint setup failed on the managed host; no APK verification claimed before correction.

## Trigger

JRE-only host required portable JDK17/SDK/Gradle; proxy address is scoped to each execution.

## Root Cause

Java does not inherit proxy settings, stale saved proxy refused connections; reference OpenJDK17 container metrics threw NullPointerException during lint.

## Fix

Configure current proxy only in local tool home for each build; explicit heap and -XX:-UseContainerSupport for the affected portable JDK. Android source uses AndroidX runner/Back and qualified API27 style; all build/lint checks remain enabled.
