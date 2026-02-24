# Flashpoint Database

A pure HTML5 frontend for the [Flashpoint API](https://github.com/FlashpointProject/flashpoint-database-api), letting you search, browse, and explore the full catalog of web games and animations preserved by [Flashpoint](https://bluemaxima.org/flashpoint).

## Features

* **Home page** - Live entry counts, quick search, quick-link cards, and a "Recently Added" feed
* **Advanced search** - Filter by title, developer, publisher, platform, tags, play mode, status, and more
* **Entry viewer** - Logo/screenshot previews, full metadata table, additional app listings, and direct play links for supported formats (SWF, WRL, X3D)
* **Statistics** - Total entries by library, format, and platform
* **Archive downloads** - In conjunction with [Flashpoint Zipper](https://github.com/WumboSpasm/flashpoint-zipper)

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
| `API_BASE` | Flashpoint database API root |
| `IMAGES_BASE` | Logo and screenshot image host |
| `ICONS_BASE` | Platform icon host |
| `RESULTS_PER_PAGE` | Number of search results per page (default: 100) |

## Project Structure

```
.github/workflows/
  ci.yml             GitHub Actions CI – runs lint on push/PR
assets/              Static assets (logo, icons, favicon)
css/
  base.css           Global styles, typography, form controls, tables
  navbar.css         Top navigation bar
  home.css           Home page layout and cards
  search.css         Search panel, results list, entry viewer
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

A GitHub Actions CI workflow (`.github/workflows/ci.yml`) runs the full lint suite on every push and pull request to `master`/`main`.

## Pages

### Home (`/`)
Displays Flashpoint branding, live game/animation counts, a search bar that redirects to the search page, three quick-link cards, and the five most recently added entries.

### Search (`/search`)
Split-pane layout with a fixed search panel on the left and scrollable results on the right. Supports multiple search fields, NSFW filtering, match-any mode, pagination toggle, and sort options (title, creator, platform, date added/modified, random). Clicking a result opens the entry viewer with images, full metadata, and additional apps.

### Statistics (`/statistics`)
Shows total entries broken down by library (Games / Animations), format (Legacy / GameZIP), and a sortable platform table.

## Browser Support

Requires a modern browser with ES module support. Tested in current versions of Chrome, Firefox, Safari, and Edge.

## License

[MIT](LICENSE) - Copyright (c) 2023 IWumboYouWumbo

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of notable changes.
