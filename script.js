const mintSearchParams = new URLSearchParams({
    q: '',
    el_2220: 'ex',
    el_1353: 'ex',
    el_1349: 'ex',
    el_1332: 'ex',
    el_1327: 'ex',
    el_1314: 'ex',
    el_1320: 'ex',
    el_1330: 'ex',
    el_1321: 'ex',
    el_1336: 'ex',
    s_translated: 'in',
});

const readSearchParams = new URLSearchParams({
    el_5685: 'ex',
    el_2158: 'ex',
    el_2141: 'ex',
    el_2135: 'ex',
    el_2122: 'ex',
    el_2128: 'ex',
    el_2139: 'ex',
    el_2129: 'ex',
    s_translated: 'in',
});

const mintmangaBaseUrl = 'https://mintmanga.live';
const readmangaBaseUrl = 'https://readmanga.me';

function loadTiles(baseUrl, searchParams, siteId) {
    $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(`${baseUrl}/search/advanced?${searchParams.toString()}`),
        data => {
            const tiles = $(data.contents).find('.tile');
            const titles = tiles.find('h3 a');
            const bookmarks = tiles.find('span.bookmark-menu');

            const resultsDiv = document.createElement('div');
            resultsDiv.classList.add(`results-${siteId}`);
            document.body.append(resultsDiv);

            console.log(`total - ${titles.length}`);

            let link, linkWrap, refreshStatus;
            for (let i = 0; i < titles.length; i++) {
                linkWrap = document.createElement('div');
                linkWrap.style = 'display: block; font-size: 1.5em; padding: .5em';

                refreshStatus = document.createElement('span');
                refreshStatus.innerHTML = '<i class="icon icon-refresh"></i>';
                refreshStatus.style = 'margin-left: 20px;';
                refreshStatus.setAttribute('onclick', `getStatus(${bookmarks[i].dataset['id']}, ${siteId})`);

                link = document.createElement('a');
                link.innerText = titles[i].title;
                link.target = '_blank';
                link.href = baseUrl + titles[i].pathname;
                link.dataset['id'] = bookmarks[i].dataset['id'];

                linkWrap.append(link, refreshStatus);

                resultsDiv.append(linkWrap);
            };
        }
    );
}

function setStatus(data) {
    const script = $('.statusScript');
    const id = script.attr('id');
    const title = $(`[data-id="${id}"]`);
    if (title.children().length == 0) {
        title[0].innerHTML += `<span> -- ${data.data.status}</span>`;
    } else {
        title.children()[0].innerText = ` -- ${data.data.status}`;
    }
    script.remove();
}

function getStatus(id, site) {
    const statusScript = document.createElement('script');
    statusScript.id = id;
    statusScript.classList.add('statusScript');
    statusScript.src = `https://grouple.co/external/status?callback=setStatus&id=${id}&site=${site}&user=582791`
    document.body.append(statusScript);
}

console.log('loading readmanga');
loadTiles(readmangaBaseUrl, readSearchParams, 1);
console.log('loading mintmanga');
setTimeout(loadTiles, 1000, mintmangaBaseUrl, mintSearchParams, 2);
