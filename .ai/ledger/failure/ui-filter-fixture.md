---
kind: failure
id: ui-filter-fixture
title: UI fixture retained catalog filters
occurrences:
  - 2026-10-05 (self-report)
sources:
  - self-report
---

# UI fixture retained catalog filters

**Seen 1 time(s):** 2026-10-05 (self-report)

## Symptom

New UI surprise regression passed, but a later category assertion expected a mission excluded by test setup.

## Trigger

The home test sets catalog time/place to prove the surprise ignores them, then the same test continues into the original catalog flow.

## Root Cause

Test setup kept those catalog filters active across independent flow assertions.

## Fix

Reset filters through the real UI handler after the home-surprise assertion; keep all existing catalog assertions.
