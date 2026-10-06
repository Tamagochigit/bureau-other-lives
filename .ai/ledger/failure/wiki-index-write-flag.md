---
kind: failure
id: wiki-index-write-flag
title: Wiki index rejects unsupported write flag
occurrences:
  - 2026-10-04 (self-report)
  - 2026-10-07 (self-report) - Universal-sharing batch repeated the unsupported --write flag; inspected help and used index with no flag. No product files changed by failed command.
sources:
  - self-report
---

# Wiki index rejects unsupported write flag

**Seen 2 time(s):** 2026-10-04 (self-report), 2026-10-07 (self-report) - Universal-sharing batch repeated the unsupported --write flag; inspected help and used index with no flag. No product files changed by failed command.

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

## Recurrence resolution — 2026-10-07

Agent /root repeated the unsupported flag during universal-sharing index refresh (exit 2), then inspected help and successfully used `akinator_wiki.py index` (exit 0). Distillation decision: neither a new skill nor product rule; this is an existing CLI invocation mistake, with the correct signature recorded here and in the operations refresh procedure. No user product preference or approval is inferred. Review the advertised help if the installed plugin version changes.
