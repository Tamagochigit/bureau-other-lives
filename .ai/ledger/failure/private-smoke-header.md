---
kind: failure
id: private-smoke-header
title: Private smoke used the wrong service header
occurrences:
  - 2026-10-04 (self-report)
sources:
  - self-report
---

# Private smoke used the wrong service header

**Seen 1 time(s):** 2026-10-04 (self-report)

## Symptom

Private runtime-config smoke returned 401 instead of the expected 200.

## Trigger

Using a native Site service credential for a read-only deployed smoke.

## Root Cause

Assumed standard Authorization instead of the prescribed Sites service header.

## Fix

Read the Sites identity reference; use OAI-Sites-Authorization only to the same Site with manual redirect mode. Config, chat module and health returned 200; user API still required visitor identity with 401.
