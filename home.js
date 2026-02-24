import { renderNavbar } from './js/navbar.js';
import { fetchJson } from './js/api.js';

renderNavbar('home');

fetchJson('/stats').then(json => {
    document.querySelector('.home-games').textContent = json.libraryTotals[0].count.toLocaleString();
    document.querySelector('.home-animations').textContent = json.libraryTotals[1].count.toLocaleString();
});

fetchJson('/search?orderBy=dateAdded&orderDirection=DESC&limit=5&fields=id,title,developer,platform,dateAdded').then(json => {
    let list = document.querySelector('.home-recent-list');

    for (let entry of json) {
        let item = document.createElement('a');
        item.className = 'home-recent-item';
        item.href = 'search#' + entry.id;

        let title = document.createElement('div');
        title.className = 'home-recent-item-title';
        title.textContent = entry.title;

        let meta = document.createElement('div');
        meta.className = 'home-recent-item-meta';

        let parts = [];
        if (entry.developer) parts.push(entry.developer);
        if (entry.platform) parts.push(entry.platform);
        if (entry.dateAdded) parts.push(new Date(entry.dateAdded).toLocaleDateString());
        meta.textContent = parts.join(' \u2022 ');

        item.append(title, meta);
        list.append(item);
    }
}).catch(() => {
    document.querySelector('.home-recent').style.display = 'none';
});

function initializeSearch() {
    localStorage.setItem('query', document.querySelector('.home-search-input').value);
    location.href = 'search';
}

document.querySelector('.home-search-input').addEventListener('keyup', e => { if (e.key == 'Enter') initializeSearch(); });
document.querySelector('.home-search-button').addEventListener('click', initializeSearch);
