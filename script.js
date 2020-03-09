$.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(
    'https://mintmanga.live/search/advanced?=q=&el_2220=&el_1353=ex&el_1346=&el_1334=&el_1339=&el_1333=&el_1347=&el_1337=&el_1343=&el_1349=ex&el_1332=&el_1310=&el_5229=&el_1311=&el_1351=&el_1328=&el_1318=&el_1325=&el_5676=&el_1327=ex&el_1342=&el_1322=&el_1335=&el_1313=&el_1316=&el_1350=&el_1314=ex&el_1320=ex&el_1326=&el_1330=ex&el_1321=ex&el_1329=&el_1344=&el_1341=&el_1317=&el_1323=&el_1319=&el_1340=&el_1354=&el_1315=&el_1336=ex&el_4614=&el_1355=&el_5232=&el_2741=&el_1903=&el_2173=&el_1873=&el_1875=&el_1874=in&el_5688=&el_1348=&el_3969=&el_3968=&el_3990=&s_high_rate=&s_single=&s_mature=&s_completed=&s_translated=in&s_many_chapters=&s_wait_upload=&years=1961%2C2020'),
    data => {
        const tiles = $(data.contents).find('.tile');
        const titles = tiles.find('h3 a');
        const bookmarks = tiles.find('span.bookmark-menu');
        let link, linkWrap, refreshStatus;
        for (let i = 0; i < titles.length; i++) {
            linkWrap = document.createElement('div');
            linkWrap.style = 'display: block; font-size: 1.5em; padding: .5em';

            refreshStatus = document.createElement('span');
            refreshStatus.innerHTML = '<i class="icon icon-refresh"></i>';
            refreshStatus.style = 'margin-left: 20px;';
            refreshStatus.setAttribute('onclick', `getStatus(${bookmarks[i].dataset['id']})`);

            link = document.createElement('a');
            link.innerText = titles[i].title;
            link.target = '_blank';
            link.href = `https://mintmanga.live${titles[i].pathname}`;
            link.dataset['id'] = bookmarks[i].dataset['id'];

            linkWrap.append(link, refreshStatus);

            $('.results').append(linkWrap);
        };
    }
);

function setStatus(data) {
    console.log(data);
    script = $('.statusScript');
    id = script.attr('id');
    $(`[data-id="${id}"]`)[0].innerText += ` -- ${data.data.status}`;
    script.remove();
}

function getStatus(id) {
    statusScript = document.createElement('script');
    statusScript.id  = id;
    statusScript.classList.add('statusScript');
    statusScript.src = `https://grouple.co/external/status?callback=setStatus&id=${id}&site=2&user=582791`
    document.body.append(statusScript);
}