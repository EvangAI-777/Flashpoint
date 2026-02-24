export function renderNavbar(currentPage) {
    const isRoot = currentPage === 'home';
    const prefix = isRoot ? '.' : '..';

    const nav = document.createElement('div');
    nav.className = 'navbar';

    const links = [
        { href: `${prefix}/`,           className: 'navbar-logo', html: `<img src="${prefix}/assets/logo.svg" height="100%"><span>Flashpoint Database</span>` },
        { href: `${prefix}/search`,     text: 'Search' },
        { href: `${prefix}/statistics`, text: 'Statistics' },
        { href: 'https://github.com/FlashpointProject/flashpoint-database', text: 'Source Code', className: 'navbar-right' },
        { href: 'https://bluemaxima.org/flashpoint', text: 'Back to Home' },
    ];

    for (const link of links) {
        const a = document.createElement('a');
        a.href = link.href;
        if (link.className) a.className = link.className;
        if (link.html) a.innerHTML = link.html;
        if (link.text) a.textContent = link.text;
        nav.appendChild(a);
    }

    document.body.prepend(nav);
}
