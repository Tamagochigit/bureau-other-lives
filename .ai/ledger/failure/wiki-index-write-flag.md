---
kind: failure
id: wiki-index-write-flag
title: Wiki index rejects unsupported write flag
occurrences:
  - 2026-10-04 (self-report)
sources:
  - self-report
---

# Wiki index rejects unsupported write flag

**Seen 1 time(s):** 2026-10-04 (self-report)

## Symptom

akinator_wiki.py index --write exited 2.

## Trigger

Regenerating the wiki index after the chat knowledge batch.

## Root Cause

An unsupported CLI flag was assumed rather than reading the advertised signature.

## Fix

Read index --help, then ran index without the flag; index and consistency check succeeded.

## Prevention

Use advertised CLI arguments and inspect help when uncertain.

## Source

Observed self-report, 2026-10-04

## Status

fixed
