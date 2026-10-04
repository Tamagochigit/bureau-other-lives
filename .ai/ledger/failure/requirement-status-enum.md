---
kind: failure
id: requirement-status-enum
title: Requirement ledger rejected decorated status
occurrences:
  - 2026-10-04 (self-report)
sources:
  - self-report
---

# Requirement ledger rejected decorated status

**Seen 1 time(s):** 2026-10-04 (self-report)

## Symptom

Requirement add exited 1 before writing the record.

## Trigger

Putting publication progress in the requirement status value.

## Root Cause

The CLI accepts only the missing, changed, current or dropped status enum.

## Fix

Use current for status and put pending publication receipts in acceptance.
