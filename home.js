import { renderNavbar } from './js/navbar.js';
import { fetchJson } from './js/api.js';

renderNavbar('home');

fetchJson('/stats').then(json => {
    document.querySelector('.home-games').textContent = json.libraryTotals[0].count.toLocaleString();
    document.querySelector('.home-animations').textContent = json.libraryTotals[1].count.toLocaleString();
});

function initializeSearch() {
    localStorage.setItem('query', document.querySelector('.home-search-input').value);
    location.href = 'search';
}

document.querySelector('.home-search-input').addEventListener('keyup', e => { if (e.key == 'Enter') initializeSearch(); });
document.querySelector('.home-search-button').addEventListener('click', initializeSearch);
