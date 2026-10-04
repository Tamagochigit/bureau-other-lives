---
kind: failure
id: pages-fixture-repeat
title: Pages test fixture omitted repeat flag
occurrences:
  - 2026-10-04 (self-report)
sources:
  - self-report
---

# Pages test fixture omitted repeat flag

**Seen 1 time(s):** 2026-10-04 (self-report)

## Symptom

One new Pages integration test failed before executing the application.

## Trigger

Creating a saved diary entry for the privacy/deep-link test.

## Root Cause

The fixture omitted the required boolean repeat field; real core validation rejected it.

## Fix

Supply repeat:false, then rerun the failed Pages scope; keep validation and assertions unchanged.
