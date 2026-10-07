---
kind: failure
id: store-description-provider-paragraph
title: Draft listing retained the previous Telegram paragraph
occurrences:
  - 2026-10-07 (self-report)
sources:
  - self-report
---

# Draft listing retained the previous Telegram paragraph

## Symptom

Final kit assertion rejected Telegram text in draft listing.txt/description.txt before any upload or store submission.

## Trigger

Reuse of the previous0.4.1 listing while preparing universal-sharing0.4.2 copy.

## Root Cause

Replacing only the last blank-line paragraph left an earlier provider-specific paragraph in the copied text.

## Fix

Remove that complete provider paragraph, regenerate listing and metadata from the four authoritative field files, assert no provider-specific text in description/listing/moderator note, and verify actual18/59/1225/157 character counts against30/80/4000/180. Final14-file archive excludes private materials. No incorrect text was delivered or submitted.

## Status

fixed

## Prevention

Validate actual final copy content, not just field limits. Revise when copying a listing across a changed product contract.
