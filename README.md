# Flashpoint Database
This is a pure HTML5 frontend for the [Flashpoint API](https://github.com/FlashpointProject/flashpoint-database-api).

## Features
* Advanced database searching
* Entry viewer with additional app, file listing support
* Archive downloads in conjunction with the [Flashpoint Zipper](https://github.com/WumboSpasm/flashpoint-zipper)
* Entry count statistics

## Development
This project uses ES modules and requires a local HTTP server to run. Start one with:

```
npm run dev
```

Or use any static file server (e.g. `python3 -m http.server`).

## Project Structure
```
assets/          Static assets (images, icons)
css/             Stylesheets split by concern
js/              Shared JS modules (config, API, navbar)
search/          Search page and its modules
statistics/      Statistics page
index.html       Home page
home.js          Home page logic
```

## To-do
* Make the site prettier
* Add stuff to the homepage
* Hunt for bugs
