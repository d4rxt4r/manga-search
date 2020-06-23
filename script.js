const baseUrls = ['https://readmanga.me', 'https://mintmanga.live']

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

function getTitlesFromPage(siteId, offset = 0) {
    $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(`${baseUrls[siteId - 1]}/list?sortType=rate&filter=translated&offset=${offset}`),
        data => {
            const tiles = $(data.contents).find('.tile');
            const tilesTag = tiles.find('.tags');
            const titles = tiles.find('h3 a');
            const bookmarks = tiles.find('span.bookmark-menu');

            if (document.getElementsByClassName('results')[0]) document.getElementsByClassName('results')[0].remove();

            const resultsDiv = document.createElement('div');
            resultsDiv.classList.add('results');
            document.body.append(resultsDiv);

            if (titles.length == 0) {
                const emptyResults = document.getElementById('noResults').content.cloneNode(true);
				resultsDiv.append(emptyResults);
            } else {
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
                    if (tilesTag[i].children.length != 2) {
                        link.innerText += ' (Сингл)';
                    }
                    link.target = '_blank';
                    link.href = baseUrls[siteId - 1] + titles[i].pathname;
                    link.dataset['id'] = bookmarks[i].dataset['id'];

                    linkWrap.append(link, refreshStatus);

                    resultsDiv.append(linkWrap);
                };
            }
        }
    );
}

const loadBtn = document.getElementById('load');
let siteSelect = document.getElementById('siteSelect');
let pageInput = document.getElementById('pageInput');

let siteIdCookie = Cookies.get('siteId');
let pageNumCookie = Cookies.get('pageNum');

if (siteIdCookie != undefined && pageNumCookie != undefined) {
	siteSelect.value = siteIdCookie;
    pageInput.value = pageNumCookie;
    getTitlesFromPage(siteSelect.value, (pageInput.value - 1) * 70);
} else {
    getTitlesFromPage(1, 0);
}

loadBtn.addEventListener('click', () => {
    Cookies.set('siteId', siteSelect.value, { expires: 365 });
    Cookies.set('pageNum', pageInput.value, { expires: 365 });
    getTitlesFromPage(siteSelect.value, (pageInput.value - 1) * 70);
});