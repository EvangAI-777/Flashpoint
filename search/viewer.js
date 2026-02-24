import { state, metaMap, addAppMap } from './search.js';
import { API_BASE, IMAGES_BASE } from '../js/config.js';

export async function loadEntry(e) {
    let id;

    if (e != undefined) {
        try { id = state.list[e.target.getAttribute('view')].id; } catch { return; }
        document.querySelector('.viewer-back').hidden = false;
    }
    else if (location.hash.length == 37) {
        id = location.hash.substring(1);
        document.querySelector('.viewer-back').hidden = true;
    }
    else return;

    location.hash = id;
    state.lastScrollPos = document.querySelector('.results').scrollTop;

    document.querySelector('.results-top').style.display = 'none';
    document.querySelector('.results-list').hidden = true;
    document.querySelector('.results-bottom').hidden = true;
    document.querySelector('.results > .common-loading').hidden = false;

    let entry = (await fetch(`${API_BASE}/search?id=${id}&limit=1`).then(r => r.json()))[0];

    document.querySelector('.viewer-play').style.display = (() => {
        let launchPath;
        try { launchPath = new URL(entry.launchCommand).pathname; } catch { return 'none'; }

        if (['.swf', '.wrl', '.wrl.gz', '.x3d'].some(ext => launchPath.toLowerCase().endsWith(ext))) {
            document.querySelector('.viewer-play').href = 'https://ooooooooo.ooo/?id=' + id;
            return 'unset';
        }
        else return 'none';
    })();

    let logo = `${IMAGES_BASE}/Logos/${id.substring(0, 2)}/${id.substring(2, 4)}/${id}.png`,
        screenshot = `${IMAGES_BASE}/Screenshots/${id.substring(0, 2)}/${id.substring(2, 4)}/${id}.png`;

    document.querySelector('.viewer-logo a').href = logo;
    document.querySelector('.viewer-logo img').style.visibility = 'hidden';
    document.querySelector('.viewer-logo img').onload = e => e.target.style.visibility = 'visible';
    document.querySelector('.viewer-logo img').src = logo + '?type=jpg';

    document.querySelector('.viewer-screenshot a').href = screenshot;
    document.querySelector('.viewer-screenshot img').style.visibility = 'hidden';
    document.querySelector('.viewer-screenshot img').onload = e => e.target.style.visibility = 'visible';
    document.querySelector('.viewer-screenshot img').src = screenshot + '?type=jpg';

    let metaTable = document.querySelector('.viewer-metadata');
    while (metaTable.firstChild)
        metaTable.removeChild(metaTable.firstChild);

    for (let field in metaMap) {
        if (entry[field].length > 0 || typeof(entry[field]) == 'boolean') {
            let row = document.createElement('tr'),
                fieldName  = document.createElement('td'),
                fieldValue = document.createElement('td');

            fieldName.textContent = metaMap[field] + ':';

            switch (field) {
                case 'library':
                    fieldValue.textContent = entry[field] == 'arcade'
                        ? 'Games'
                        : 'Animations';
                    break;
                case 'tags':
                    let ul = document.createElement('ul');
                    for (let tag of entry.tags) {
                        let li = document.createElement('li');
                        li.textContent = tag;
                        ul.append(li);
                    }
                    fieldValue.append(ul);
                    break;
                case 'releaseDate':
                    fieldValue.textContent = new Date(entry[field]).toLocaleDateString(undefined, { timeZone: 'UTC' });
                    break;
                case 'dateAdded':
                case 'dateModified':
                    fieldValue.textContent = new Date(entry[field]).toLocaleString();
                    break;
                case 'zipped':
                    fieldValue.textContent = entry[field] ? 'GameZIP' : 'Legacy';
                    break;
                case 'notes':
                case 'originalDescription':
                    fieldValue.style.whiteSpace = 'pre-wrap';
                default:
                    fieldValue.textContent = entry[field];
            }

            row.append(fieldName, fieldValue);
            metaTable.append(row);
        }
    }

    let addApps = await fetch(`${API_BASE}/addapps?id=${id}`).then(r => r.json()),
        addAppTables = document.querySelector('.viewer-add-apps');
    if (addApps.length > 0) {
        while (addAppTables.firstChild)
            addAppTables.removeChild(addAppTables.firstChild);

        for (let app of addApps) {
            let table = document.createElement('table');
            table.className = 'common-table';

            for (let field in addAppMap) {
                let row = document.createElement('tr'),
                    fieldName  = document.createElement('td'),
                    fieldValue = document.createElement('td');

                fieldName.textContent  = addAppMap[field] + ':';
                fieldValue.textContent = app[field];

                row.append(fieldName, fieldValue);
                table.append(row);
            }

            addAppTables.append(table);
        }

        addAppTables.hidden = false;
        document.querySelector('.viewer-add-apps-header').hidden = false;
    }
    else {
        addAppTables.hidden = true;
        document.querySelector('.viewer-add-apps-header').hidden = true;
    }

    document.querySelector('.results > .common-loading').hidden = true;
    document.querySelector('.viewer').style.display = 'flex';
}

export function backToResults() {
    location.hash = '';
    document.querySelector('.viewer').style.display = 'none';
    document.querySelector('.results-top').style.display = 'flex';
    document.querySelector('.results-list').hidden = false;
    document.querySelector('.results-bottom').hidden = state.pages < 2;
    document.querySelector('.results').scrollTop = state.lastScrollPos;
}
