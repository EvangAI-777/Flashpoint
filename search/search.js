import { renderNavbar } from '../js/navbar.js';
import { fetchJson } from '../js/api.js';
import { RESULTS_PER_PAGE, IMAGES_BASE, ICONS_BASE } from '../js/config.js';
import { initFields } from './fields.js';
import { performSearch, applySort, loadPage, loadPageFromInput } from './results.js';
import { loadEntry, backToResults } from './viewer.js';

renderNavbar('search');

export const state = {
    resultsPerPage: RESULTS_PER_PAGE,
    images: IMAGES_BASE,
    icons: ICONS_BASE,
    platforms: [],
    sortOptions: [],
    list: [],
    pages: 0,
    currentPage: 1,
    displayedResults: 0,
    lastScrollPos: 0
};

export const metaMap = {
    title:               "Title",
    alternateTitles:     "Alternate Titles",
    series:              "Series",
    developer:           "Developer",
    publisher:           "Publisher",
    source:              "Source",
    library:             "Library",
    tags:                "Tags",
    platform:            "Platform",
    playMode:            "Play Mode",
    status:              "Status",
    version:             "Version",
    releaseDate:         "Release Date",
    language:            "Language",
    notes:               "Notes",
    originalDescription: "Original Description",
    dateAdded:           "Date Added",
    dateModified:        "Last Modified",
    applicationPath:     "Application Path",
    launchCommand:       "Launch Command",
    zipped:              "Format",
    id:                  "ID"
};

export const addAppMap = {
    name:                "Name",
    applicationPath:     "Application Path",
    launchCommand:       "Launch Command",
    id:                  "ID"
};

fetchJson('/platforms').then(json => { state.platforms = json; });

initFields();

fetch('sort.json').then(r => r.json()).then(json => {
    state.sortOptions = json;

    for (let sort of json) {
        let opt = document.createElement('option');
        opt.value = sort.name;
        opt.innerText = sort.displayName;

        if (sort.name == 'title') opt.selected = true;

        document.querySelector('.results-sort-options').append(opt);
    }

    document.querySelectorAll('.results-sort > select').forEach(elem => elem.addEventListener('change', applySort));
});

document.querySelector('.search-button').addEventListener('click', performSearch);

document.querySelector('#compact').addEventListener('change', () => loadPage(state.currentPage));

document.querySelectorAll('.results-first-page').forEach(elem => elem.addEventListener('click', () => { if (state.currentPage > 1) loadPage(1); }));
document.querySelectorAll('.results-back-page').forEach(elem => elem.addEventListener('click', () => { if (state.currentPage > 1) loadPage(state.currentPage - 1); }));
document.querySelectorAll('.results-forward-page').forEach(elem => elem.addEventListener('click', () => { if (state.currentPage < state.pages) loadPage(state.currentPage + 1); }));
document.querySelectorAll('.results-last-page').forEach(elem => elem.addEventListener('click', () => { if (state.currentPage < state.pages) loadPage(state.pages); }));

document.querySelectorAll('.results-go-to-page').forEach((elem, i) => elem.addEventListener('click', () => loadPageFromInput(document.querySelectorAll('.results-input-page')[i])));
document.querySelectorAll('.results-input-page').forEach(elem => elem.addEventListener('keyup', e => { if (e.key == 'Enter') loadPageFromInput(e.target); }));

document.querySelector('.viewer-back').addEventListener('click', backToResults);
