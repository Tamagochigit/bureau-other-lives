---
kind: requirement
id: universal-sharing
title: Universal sharing without an address book
occurrences:
  - 2026-10-07 (owner request, Moscow)
sources:
  - self-report
---

# Universal sharing without an address book

## Statement

Owner: «У нас друзья телеграмм, а он разрешен? Ну лучше сделать универсальным поделиться?»; optional UX answer: «Без списка».

## Status

current

## Source

Owner 2026-10-07 Moscow (2026-10-06 UTC). Use existing applications without making a messenger or requiring Telegram. The owner chose no separate address book; recipient selection belongs to the OS/chosen app. No permission to erase existing contact bytes is inferred.

## Acceptance

R11/R12/R14/R22: system chooser on Android, Web Share/copy/selectable fallback on web, known public mission only, silent cancellation, no diary/recipient read or delivery claim. Preserve diary v1, old stored contacts, package and signing key; increment versionCode to 6 (0.4.2). Current facts/rules/router/copy, tests, verified build/signature and published website/catalog must agree. Store submission is outside this task. Canonical homes: docs/product.md, architecture.md, android.md, testing.md and rustore.md. Revise when scope/payload/recipient/account/data changes.
