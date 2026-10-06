---
kind: failure
id: android-ci-missing-metadata
title: Fresh Android CI required two unrecorded metadata checksums
occurrences:
  - 2026-10-06 (run 37375398529 from 2026-10-05)
sources:
  - self-report
---

# Fresh Android CI required two unrecorded metadata checksums

**Seen 1 time(s):** 2026-10-06 (run 37375398529 from 2026-10-05)

## Symptom

SDK setup passed; classpath verification rejected guava-parent-33.3.1-jre.pom and junit-bom-5.10.2.module.

## Trigger

A fresh GitHub runner resolved parent/module metadata absent from the local cached resolution.

## Root Cause

The local cached resolution had not recorded these exact parent/module metadata artifacts which a fresh runner resolves.

## Fix

Fetch exact Maven Central HTTPS artifacts, review coordinates/content and SHA-256; add only those entries. Preserve strict verification, do not auto-trust a fresh resolution. Observe the next CI result separately.
