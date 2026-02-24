# Changelog

All notable changes to the Flashpoint Database frontend are documented in this file.

## [Unreleased]

### Added
- **Home page content**: project description, quick-link cards (Advanced Search, Statistics, Get Flashpoint), and a "Recently Added" section showing the 5 most recent entries
- **API error handling**: `fetchJson` now throws on non-OK HTTP responses instead of silently returning invalid data
- **Expanded README**: configuration reference, per-page descriptions, detailed project structure, browser support notes, and changelog link

### Changed
- **Visual overhaul**: modernized styling across all pages
  - Updated font stack to Segoe UI with proper fallbacks
  - Added light gray page background and refined color palette
  - Navbar uses a subtle gradient with translucent hover highlights
  - Form inputs and buttons have rounded borders, focus rings, and hover/active transitions
  - Styled buttons with brand-red background and press feedback
  - Themed checkboxes with accent color
  - Search results highlight on hover
  - Statistics displayed in card-based layout with shadows
  - Viewer images have rounded borders with consistent spacing
  - Table rows highlight on hover
- **Home page search bar**: joined input and button with connected border-radius for a unified look

### Fixed
- **Viewer play button**: IIFE returned boolean `true` instead of CSS value `'none'` when URL parsing failed, causing the play link to remain visible for non-playable entries
- **Image load listener leak**: `addEventListener('load', ...)` stacked a new handler on every `loadEntry()` call; switched to `onload` property assignment
- **URL encoding in search**: manual character replacement missed `=`, `?`, and other special characters; replaced with `encodeURIComponent` for correct encoding
