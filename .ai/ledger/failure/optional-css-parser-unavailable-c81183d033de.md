---
kind: failure
id: optional-css-parser-unavailable-c81183d033de
title: Optional CSS parser unavailable
occurrences:
  - 2026-10-04 (observed optional check)
sources:
  - observed optional check
---

# Optional CSS parser unavailable

**Seen 1 time(s):** 2026-10-04 (observed optional check)

## Symptom

System Python cannot import tinycss2

## Trigger

Optional stylesheet syntax inspection after application gates passed

## Root Cause

Optional parser is not installed in system Python

## Fix

Retained passing application checks and documented visual verification limits; no browser installed

## Rule Decision

No invariant: dependency absence is environment-specific

## Verification

Core and real-UI event suite previously exited zero; no CSS layout pass claimed
