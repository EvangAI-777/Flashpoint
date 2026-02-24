# Flashpoint Database

A pure HTML5 frontend for the [Flashpoint API](https://github.com/FlashpointProject/flashpoint-database-api), letting you search, browse, and explore the full catalog of web games and animations preserved by [Flashpoint](https://bluemaxima.org/flashpoint).

## Features

* **Home page** - Live entry counts, quick search, quick-link cards, and a "Recently Added" feed
* **Advanced search** - Filter by title, developer, publisher, platform, tags, play mode, status, and more
* **Entry viewer** - Logo/screenshot previews, full metadata table, additional app listings, and direct play links for supported formats (SWF, WRL, X3D)
* **Statistics** - Total entries by library, format, and platform
* **Archive downloads** - In conjunction with [Flashpoint Zipper](https://github.com/WumboSpasm/flashpoint-zipper) (see [Downloads / Zipper Integration](#downloads--zipper-integration))

## Getting Started

### Prerequisites

Any static file server will do. The project uses ES modules, so files must be served over HTTP (not opened as `file://`).

### Running Locally

```bash
npm install
npm run dev
```

Or use any alternative:

```bash
python3 -m http.server
```

Then open `http://localhost:3000` (or whichever port your server uses).

### Configuration

API endpoints and display constants are defined in `js/config.js`:

| Constant | Description |
|---|---|
| `API_BASE` | Flashpoint database API root (`https://db-api.unstable.life`) |
| `IMAGES_BASE` | Logo and screenshot image host (`https://infinity.unstable.life/images`) |
| `ICONS_BASE` | Platform icon host (GitHub Pages-hosted logos) |
| `RESULTS_PER_PAGE` | Number of search results per page (default: 100) |

## Project Structure

```
.github/workflows/
  ci.yml             GitHub Actions CI – runs lint on push/PR
  deploy.yml         GitHub Pages deployment (validate → deploy)
assets/              Static assets (logo, icons, favicon)
css/
  base.css           Global styles, typography, form controls, tables
  navbar.css         Top navigation bar
  home.css           Home page layout and cards
  search.css         Search panel, results list, entry viewer, download table
  statistics.css     Statistics cards and platform table
js/
  config.js          API endpoints and constants
  api.js             Shared fetch wrapper with error handling
  navbar.js          Navbar renderer (highlights current page)
search/
  index.html         Search page markup
  search.js          Search state, initialization, event wiring
  fields.js          Dynamic search field management
  results.js         Search execution, sorting, pagination, result rendering
  viewer.js          Single-entry detail viewer
  fields.json        Available search fields and their options
  sort.json          Available sort options and their backing fields
statistics/
  index.html         Statistics page markup
  statistics.js      Fetches and renders entry count statistics
index.html           Home page
home.js              Home page logic (stats, recent entries, search redirect)
404.html             Custom 404 error page (used by GitHub Pages)
.nojekyll            Prevents Jekyll processing on GitHub Pages
```

## Linting

Install dev dependencies and run all linters:

```bash
npm install
npm run lint
```

Individual linters can be run separately:

| Script | Tool | Scope |
|---|---|---|
| `npm run lint:html` | html-validate | All `*.html` files |
| `npm run lint:css` | Stylelint | `css/**/*.css` |
| `npm run lint:js` | ESLint (flat config) | All `*.js` files |
| `npm run lint:json` | Node.js JSON.parse | Data files (`fields.json`, `sort.json`, `package.json`) |

## CI / CD

### CI (`.github/workflows/ci.yml`)

Runs the full lint suite on every push and pull request to `master`/`main`. Steps:

1. Install dependencies (`npm ci`)
2. Validate HTML (`html-validate`)
3. Lint CSS (`stylelint`)
4. Lint JavaScript (`eslint`)
5. Validate JSON data files

### GitHub Pages Deployment (`.github/workflows/deploy.yml`)

Deploys the site to GitHub Pages on every push to `master`/`main`. The workflow runs the same validation steps first, then deploys only the site files (HTML, CSS, JS, assets) — dev tooling and config files are excluded from the published artifact.

**To enable GitHub Pages:**

1. Go to **Settings → Pages** in the repository
2. Under **Source**, select **GitHub Actions**
3. The deploy workflow will run automatically on the next push to `main`

See [Developer Notes: GitHub Pages](#github-pages) below for important caveats.

## Pages

### Home (`/`)
Displays Flashpoint branding, live game/animation counts, a search bar that redirects to the search page, three quick-link cards, and the five most recently added entries.

### Search (`/search`)
Split-pane layout with a fixed search panel on the left and scrollable results on the right. Supports multiple search fields, NSFW filtering, match-any mode, pagination toggle, and sort options (title, creator, platform, date added/modified, random). Clicking a result opens the entry viewer with images, full metadata, and additional apps.

### Statistics (`/statistics`)
Shows total entries broken down by library (Games / Animations), format (Legacy / GameZIP), and a sortable platform table.

## Downloads / Zipper Integration

The frontend includes CSS for a downloads feature (`.download-center`, `.download-table` in `css/search.css`) and `.gitignore` entries for `downloads/zip/*.zip` and `downloads/info.json`. This was designed to work with [Flashpoint Zipper](https://github.com/WumboSpasm/flashpoint-zipper), a companion tool that packages individual game archives for download.

**Current status:**
- The zipper repo exists but is **not actively maintained** (last commit March 2023, 7 total commits, no README or releases)
- The original author (WumboSpasm) is still active on GitHub and affiliated with [@FlashpointProject](https://github.com/FlashpointProject)
- No downloads page has been built yet — only the CSS and ignore rules exist
- Building out this feature would require either reviving the zipper tool or creating a new download pipeline

## Developer Notes

### External API Dependency

All dynamic content (search, statistics, recent entries) depends on the Flashpoint database API at `https://db-api.unstable.life`. This is an external service not controlled by this project:

| Service | URL | Purpose |
|---|---|---|
| Database API | `https://db-api.unstable.life` | Search, stats, entry metadata |
| Image CDN | `https://infinity.unstable.life/images` | Logos and screenshots |
| Platform Icons | `https://flashpointproject.github.io/flashpoint-database-logos/` | Platform icon SVGs |

If the API is unreachable or returns errors, the frontend will show empty states. The `fetchJson` wrapper in `js/api.js` throws on non-OK HTTP responses.

### GitHub Pages

The codebase is well-suited for static hosting — all internal paths are relative, there is no build step, and ES modules use standard `.js` extensions. However, there is a **critical blocker** for full functionality:

**API CORS restriction:** The Flashpoint API at `db-api.unstable.life` currently returns `403 Forbidden` with `x-deny-reason: host_not_allowed` for requests from origins it does not recognize. For the GitHub Pages deployment to work with live data, the API operators would need to:

1. Whitelist the GitHub Pages origin (e.g. `https://evangai-777.github.io`) in their CORS configuration
2. Return appropriate `Access-Control-Allow-Origin` headers for that origin

Without this, the site deploys and loads but every API-powered feature (search, statistics, recently added) will fail with CORS errors. Static content (home page layout, navigation, 404 page) works fine regardless.

**What works without API access:**
- Page navigation and routing
- Static HTML/CSS layout and styling
- 404 error page
- Platform icons (served from a separate GitHub Pages origin that allows cross-origin requests)

**What requires API access:**
- Home page entry counts and "Recently Added" feed
- All search functionality
- Statistics page data

### Architecture Notes

- **No build step** — the site is plain HTML/CSS/JS with ES modules, served as-is
- **Hash-based entry viewer** — entry UUIDs are stored in `location.hash`, so the search page is a single-page app that doesn't require server-side routing
- **Clean URL routing** — pages like `/search` and `/statistics` rely on directory `index.html` files, which work natively on most static hosts
- **Module structure** — shared utilities (`js/api.js`, `js/config.js`, `js/navbar.js`) are imported by page-specific scripts; the search page further splits logic across `search.js`, `fields.js`, `results.js`, and `viewer.js`

## Browser Support

Requires a modern browser with ES module support. Tested in current versions of Chrome, Firefox, Safari, and Edge.

## License

[MIT](LICENSE) - Copyright (c) 2023 IWumboYouWumbo

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of notable changes.
