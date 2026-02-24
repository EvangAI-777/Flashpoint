import { state } from './search.js';
import { API_BASE } from '../js/config.js';
import { loadEntry } from './viewer.js';

export function performSearch() {
    history.pushState('', '', location.pathname);

    let fields = {},
        params = [];

    document.querySelectorAll('.search-table [id]').forEach(field => {
        if (field.id in fields)
            fields[field.id] += ',' + field.value;
        else
            fields[field.id] = field.value;
    });

    for (let field in fields)
        params.push(field + '=' + fields[field]
            .replace(/%/g, '%25')
            .replace(/#/g, '%23')
            .replace(/&/g, '%26')
            .replace(/;/g, '%3B')
            .replace(/\+/g, '%2B'));

    if (document.querySelector('#filter').checked) params.push('filter=true');
    if (document.querySelector('#any').checked) params.push('any=true');

    document.querySelector('.results-top').style.display = 'none';
    document.querySelector('.results-list').hidden = true;
    document.querySelector('.results-bottom').hidden = true;
    document.querySelector('.viewer').style.display = 'none';
    document.querySelector('.results > .common-loading').hidden = false;

    fetch(`${API_BASE}/search?${params.join('&')}&fields=id,title,developer,publisher,platform,library,tags,originalDescription,dateAdded,dateModified`).then(r => r.json()).then(json => {
        state.list = json;

        if (document.querySelector('#paginate').checked) {
            state.pages = Math.ceil(state.list.length / state.resultsPerPage);
            state.displayedResults = state.resultsPerPage;
            document.querySelector('.results-per-page').hidden = false;
        }
        else {
            state.pages = 1;
            state.displayedResults = state.list.length;
            document.querySelector('.results-per-page').hidden = true;
        }

        document.querySelector('.results-total').textContent = state.list.length.toLocaleString();
        document.querySelectorAll('.results-max-pages').forEach(elem => { elem.textContent = state.pages.toLocaleString(); });

        document.querySelector('.results > .common-loading').hidden = true;
        document.querySelector('.results-top').style.display = 'flex';
        document.querySelector('.results-list').hidden = false;
        document.querySelectorAll('.results-navigate').forEach(elem => { elem.hidden = state.pages < 2; });

        applySort();
    });
}

export function applySort() {
    let sortOption = state.sortOptions[document.querySelector('.results-sort-options').selectedIndex],
        direction = document.querySelector('.results-sort-direction').selectedIndex == 0 ? 1 : -1;

    if (sortOption.name != 'random') {
        state.list = state.list.sort((a, b) => {
            let i = 0;
            while (i < sortOption.fields.length) {
                let compare = a[sortOption.fields[i]].localeCompare(b[sortOption.fields[i]], 'en', { sensitivity: 'base' });
                if (compare == 0) i++; else return compare * direction;
            }
            return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }) * direction;
        });
    }
    else {
        for (let i = state.list.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [state.list[i], state.list[j]] = [state.list[j], state.list[i]];
        }
    }

    loadPage(1);
}

export function loadPage(page) {
    let htmlList = document.querySelector('.results-list');
    while (htmlList.firstChild)
        htmlList.removeChild(htmlList.firstChild);

    state.currentPage = page;
    document.querySelectorAll('.results-current-page').forEach(elem => { elem.textContent = state.currentPage.toLocaleString(); });
    document.querySelector('.results').scrollTop = 0;

    let logoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.backgroundImage = entry.target.getAttribute('lazy-background');
                logoObserver.unobserve(entry.target);
            }
        });
    });

    for (let i = (page - 1) * state.displayedResults; i < Math.min(state.list.length, page * state.displayedResults); i++) {
        let compact = document.querySelector('#compact').checked;

        let entry = document.createElement('div');
        entry.className = 'entry';
        if (compact) entry.setAttribute('compact', 'true');

        let title = document.createElement('a');
        title.classList.add('entry-title', 'common-activate');
        title.setAttribute('view', i);
        title.textContent = state.list[i].title;
        title.addEventListener('click', loadEntry);

        let developer = document.createElement('span');
        developer.className = 'entry-developer';
        if (state.list[i].developer != '')
            developer.textContent = ' by ' + state.list[i].developer;
        else if (state.list[i].publisher != '')
            developer.textContent = ' by ' + state.list[i].publisher;
        else
            developer.hidden = true;

        let tags = document.createElement('span');
        tags.className = 'entry-tags';
        if (compact)
            tags.textContent = state.list[i].tags.join(', ');
        else
            tags.textContent = '\u00A0- ' + state.list[i].tags.join(' - ');

        let description = document.createElement('div');
        description.className = 'entry-description';
        if (state.list[i].originalDescription != '')
            description.textContent = state.list[i].originalDescription;
        else if (!compact) {
            description.textContent = 'No description.';
            description.setAttribute('empty', 'true');
        }

        if (compact) {
            let platform = document.createElement('div');
            platform.className = 'entry-platform';
            let platformName = state.list[i].platform.split('; ')[0];
            platform.style.backgroundImage = 'url("' + state.icons + platformName + '.png")';
            platform.setAttribute('title', platformName);

            let library = document.createElement('div');
            library.className = 'entry-library';
            library.style.backgroundImage = 'url("' + (state.list[i].library == 'arcade' ? '../assets/game.png' : '../assets/animation.png') + '")';
            library.setAttribute('title', state.list[i].library == 'arcade' ? 'Game' : 'Animation');

            entry.append(platform, library, title, developer, description, tags);
        }
        else {
            let logo = document.createElement('div');
            logo.className = 'entry-logo';
            logo.setAttribute('view', i);
            logo.setAttribute('lazy-background', `url("${state.images}/Logos/${state.list[i].id.substring(0, 2)}/${state.list[i].id.substring(2, 4)}/${state.list[i].id}.png?type=jpg")`);
            logo.addEventListener('click', loadEntry);
            logoObserver.observe(logo);

            let text = document.createElement('div');
            text.className = 'entry-text';

            let header = document.createElement('div'),
            subHeader = document.createElement('div');

            let type = document.createElement('span');
            type.className = 'entry-type';
            type.textContent = state.list[i].platform.replace(/; /g, '/') + (state.list[i].library == 'arcade' ? ' game' : ' animation');

            header.append(title, developer);
            subHeader.append(type, tags);
            text.append(header, subHeader, description);
            entry.append(logo, text);
        }

        htmlList.append(entry);
    }
}

export function loadPageFromInput(input) {
    let value = parseInt(input.value, 10);

    if (!isNaN(value) && value != state.currentPage && value > 0 && value <= state.pages) {
        loadPage(value);
        input.value = '';
    }
}
