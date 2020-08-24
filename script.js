const proxyUrl = 'https://api.allorigins.win/raw?url=';
const baseUrls = ['https://readmanga.live', 'https://mintmanga.live', 'http://shakai.ru/catalog/manga/']
const searchUrls = [`${baseUrls[0]}/list?sortType=votes&filter=translated`, `${baseUrls[1]}/list/tag/noyaoi?sortType=rate&filter=translated`];

function setStatus(data) {
    const script = document.querySelector('.status-script');
    const id = script.attributes.id;
    const title = document.querySelector(`[data-id="${id}"]`);
    if (title.children.length == 0) {
        title.innerHTML += `<span> -- ${data.data.status}</span>`;
    } else {
        title.children[0].innerText = ` -- ${data.data.status}`;
    }
    script.remove();
}

function getStatus(id, siteId) {
    const statusScript = document.createElement('script');
    statusScript.attributes.id = id;
    statusScript.classList.add('status-script');
    statusScript.src = `https://grouple.co/external/status?callback=setStatus&id=${id}&site=${siteId}&user=582791`
    document.body.append(statusScript);
}

async function getTitlesFromPage(siteId, offset = 0) {
    if (document.querySelector('.results')) document.querySelector('.results').remove();

    const resultsDiv = document.createElement('div');
    resultsDiv.classList.add('results');
    document.body.append(resultsDiv);

    if (siteId == 3) {
        const url = proxyUrl + encodeURIComponent(baseUrls[2] + offset);
        await fetch(url)
            .then(response => { return response.text() })
            .then(data => {
                const parser = new DOMParser();
                const parsed_document = parser.parseFromString(data, 'text/html');

                const posters = parsed_document.querySelectorAll('.poster');

                if (posters.length == 0) {
                    const emptyResults = document.getElementById('noResults').content.cloneNode(true);
                    resultsDiv.append(emptyResults);
                } else {
                    for (let i = 0; i < posters.length; i++) {
                        const description = posters[i].querySelectorAll('.poster__float-description');
                        const release = description[1].innerText;
                        const genres = description[2].innerText
                        if (!release.includes('Завершен') && genres.includes('Яой')) continue;
                        const linkWrap = document.createElement('div');
                        const link = document.createElement('a');
                        link.innerText = posters[i].querySelector('.poster__float-heading').innerText.match(/[^/]+$/gm)[0];
                        link.href = posters[i].href;
                        link.target = '_blank';
                        linkWrap.append(link);

                        linkWrap.style = 'display: block; font-size: 1.5em; padding: .5em';
                        resultsDiv.append(linkWrap);
                    }
                }
            });
    } else {
        url = proxyUrl + encodeURIComponent(`${searchUrls[siteId - 1]}&offset=${(offset - 1) * 70}`);
        await fetch(url)
            .then(response => { return response.text() })
            .then(data => {
                const parser = new DOMParser();
                const parsed_document = parser.parseFromString(data, 'text/html');

                const tiles = parsed_document.querySelectorAll('.tile');

                if (tiles.length == 0) {
                    const emptyResults = document.getElementById('noResults').content.cloneNode(true);
                    resultsDiv.append(emptyResults);
                } else {
                    for (let i = 0; i < tiles.length; i++) {
                        const linkWrap = document.createElement('div');
                        linkWrap.style = 'display: block; font-size: 1.5em; padding: .5em';

                        const refreshStatus = document.createElement('span');
                        const bookmark = tiles[i].querySelector('span.bookmark-menu');
                        refreshStatus.innerHTML = '<i class="icon icon-refresh"></i>';
                        refreshStatus.style = 'margin-left: 20px;';
                        refreshStatus.setAttribute('onclick', `getStatus(${bookmark.dataset.id}, ${siteId})`);

                        const link = document.createElement('a');
                        const title = tiles[i].querySelector('h3 a');
                        const tileTag = tiles[i].querySelector('.tags');
                        link.innerText = title.title;
                        if (tileTag.children.length != 2) {
                            link.innerText += ' (Сингл)';
                        }
                        link.target = '_blank';
                        link.href = baseUrls[siteId - 1] + title.pathname;
                        link.dataset['id'] = bookmark.dataset['id'];

                        linkWrap.append(link, refreshStatus);

                        resultsDiv.append(linkWrap);
                    };
                }
            });
    }
}

const loadBtn = document.getElementById('load');
const siteSelect = document.getElementById('siteSelect');
const pageInput = document.getElementById('pageInput');

const siteIdCookie = Cookies.get('siteId');
const pageNumCookie = Cookies.get('pageNum');

if (siteIdCookie != undefined && pageNumCookie != undefined) {
    siteSelect.value = siteIdCookie;
    pageInput.value = pageNumCookie;
    getTitlesFromPage(siteSelect.value, pageInput.value);
} else {
    getTitlesFromPage(1, 0);
}

loadBtn.addEventListener('click', () => {
    Cookies.set('siteId', siteSelect.value, { expires: 365 });
    Cookies.set('pageNum', pageInput.value, { expires: 365 });
    getTitlesFromPage(siteSelect.value, pageInput.value);
});
