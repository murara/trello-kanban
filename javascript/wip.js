const wipRegex = /\[(?:(\d+)-)?(\d+)\]/s;

function findAllLists() {
    return Array.from(document.querySelectorAll('div.list'));
}

function getListCards(list) {
    return list.querySelector('div.list-cards');
}

function countCards(list) {
    return list.querySelectorAll('a.list-card').length;
}

function getListTitle(list) {
    return list.querySelector('.list-header h2.list-header-name-assist').innerText;
}

function buildListMetada(list) {
    const title = getListTitle(list);
    const wipSearchResult = wipRegex.exec(title);

    if (!wipSearchResult) return false;

    return {
        element: list,
        count: countCards(list),
        wip: {
            min: parseInt(wipSearchResult[1]),
            max: parseInt(wipSearchResult[2])
        }
    };
}

function highlightListWithYellow(list) {
    list.style.backgroundColor = 'yellow';
}

function highlightListWithRed(list) {
    list.style.backgroundColor = 'red';
}

function revertHighlightList(list) {
    list.style.backgroundColor = '';
}

function highlightList(list, count, limit) {
    if (count === limit) highlightListWithYellow(list)
    else highlightListWithRed(list)
}

const observer = new MutationObserver(function callback(mutations) {
    mutations.forEach(function each({ target }) {
        updateElementList(target.parentElement);
    });    
});

function updateElementList(target) {
    const list = buildListMetada(target);
    if (!list) return;

    const { element, count, wip } = list;

    if (!isNaN(wip.min) && count <= wip.min) return highlightList(element, count, wip.min);
    if (!isNaN(wip.max) && count >= wip.max) return highlightList(element, count, wip.max);

    revertHighlightList(element);
}

function initLists(lists) {
    lists.forEach(function (list) {
        observer.observe(getListCards(list), { childList: true });
        updateElementList(list);
    });
}

function init() {
    const lists = findAllLists();
    initLists(lists);
}

let validateLoadingCount = 0;
let initializing = false;

function waitLoading(resolve) {
    const pluginButtons = document.querySelector(".board-header-plugin-btns");
    if (pluginButtons && pluginButtons.children.length > 0) {
        resolve();
        return;
    }

    if (validateLoadingCount > 60) return;

    validateLoadingCount++;
    setTimeout(function() { waitLoading(resolve) }, 500);
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "initialize") {
        if (initializing) return;

        observer.disconnect();

        initializing = true;
        return new Promise(waitLoading).then(init).then(()=>{ initializing = false; });
    }
});
