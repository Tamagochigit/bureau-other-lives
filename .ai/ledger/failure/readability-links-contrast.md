---
kind: failure
id: readability-links-contrast
title: Orange link contrast below chosen target
occurrences:
  - 2026-10-04 (readability check)
sources:
  - readability check
---

# Orange link contrast below chosen target

## Symptom

The contrast assertion exited 1 for orange links: 6.89:1 against warm paper, below the chosen 7:1 target.

## Trigger

Numeric inspection of the replacement stylesheet.

## Root Cause

The initial orange token was sufficiently dark for white button text but slightly lighter against the paper background.

## Fix

Darkened the orange token and reran only the failed inspection.

## Verification

Exit 0; links 7.62:1, orange button text 8.30:1. No rendered-layout result is implied.

## Rule Decision

No new rule; preserve the existing readability decision and inspect actual colour pairs when they change.
