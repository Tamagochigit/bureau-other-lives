---
kind: decision
id: distil-android-capture-document-and-size
title: Recurring failure: Real device tests exposed reload and viewport setup assumptions -> neither
---

# Recurring failure: Real device tests exposed reload and viewport setup assumptions -> neither

## What

The recurring failure `android-capture-document-and-size` becomes: neither

## Alternatives

rule, skill, or neither

## Why

Different confirmed setup faults in the same capture seam; preserve the real native gate and repair selectors/hardware config. No additional repository skill/rule duplicates the existing capture procedure or asserts a guessed pixel mode.

## Cost Accepted

Maintain the existing native gate and capture fixture procedure without a duplicate rule or skill. The gate already detects these failures; the hardware correction remains pending a new run.

## Fingerprint

android-capture-document-and-size
