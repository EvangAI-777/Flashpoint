import { state } from './search.js';
import { performSearch } from './results.js';
import { loadEntry } from './viewer.js';

export function initFields() {
    fetch('fields.json').then(r => r.json()).then(json => {
        for (let field of json) {
            let opt = document.createElement('option');
            opt.value = field.name;
            opt.innerText = field.displayName;

            document.querySelector('.search-fields-list').append(opt);
        }

        document.querySelector('.search-fields-add').addEventListener('click', () => {
            addField(json.find(field => field.name == document.querySelector('.search-fields-list').value));
        });

        addField(json[0]);

        if (localStorage.getItem('query') != null) {
            document.querySelector('.search-table input').value = localStorage.getItem('query');
            localStorage.removeItem('query');

            performSearch();
        }
        else if (location.hash.length == 37) loadEntry();
    });
}

export function addField(field) {
    let row   = document.createElement('tr'),
        name  = document.createElement('td'),
        value = document.createElement('td'),
        del   = document.createElement('button');

    del.innerText = 'X';
    del.addEventListener('click', () => { row.remove() });
    name.append(del, field.displayName + ':');

    if (field.name == 'platform')
        field.values = state.platforms.map(platform => ({ name: platform, displayName: platform }));

    if (field.values.length > 0) {
        let input = document.createElement('select');
        input.id = field.name;

        for (let value of field.values) {
            let opt = document.createElement('option');
            opt.value = value.name;
            opt.innerText = value.displayName;

            input.append(opt);
        }

        value.append(input);
    } else {
        let input = document.createElement('input');
        input.id = field.name;
        input.addEventListener('keyup', e => { if (e.key == 'Enter') performSearch(); });

        value.append(input);
    }

    row.append(name, value);
    document.querySelector('.search-table').append(row);

    document.querySelectorAll('.search-table tr:last-child input').forEach(input => { input.focus(); });
}
