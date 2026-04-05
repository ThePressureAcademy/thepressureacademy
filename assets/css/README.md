# CSS Status

This directory contains CSS files that are present in the repo but are not wired into current page rendering.

## Current Status

- [tpa-foundation.css](./tpa-foundation.css) is not linked by current live HTML or JS in this repository.
- [mm-variant.css](./mm-variant.css) is not linked by current live HTML or JS in this repository.
- Current public pages render from inline CSS inside the HTML files.

## Safe Handling Rule

- Treat these files as historical or prototype architecture assets.
- Do not wire them into live pages casually.
- Do not assume they match current inline page styling.
- If CSS extraction is revisited later, compare them against current page code first rather than treating them as canonical.

## Why They Were Kept

- They may still be useful as reference material for a future, deliberate CSS extraction pass.
- They are kept for operator visibility, not for current rendering authority.
