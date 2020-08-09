const wipRegex = /\[(?:(\d+)-)?(\d+)\]/s;

function findLists() {
    return Array.from(document.querySelectorAll('div.list'));
}

function countListCards(list) {
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
        count: countListCards(list),
        wip: {
            min: parseInt(wipSearchResult[1]),
            max: parseInt(wipSearchResult[2])
        }
    };
}

function getListsMetadata() {
    const lists = findLists();
    return lists.reduce(function (filteredLists, currentList) {
        const listMetadata = buildListMetada(currentList);

        if (listMetadata) filteredLists.push(listMetadata);

        return filteredLists;
    }, []);
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

function highlightListsWithWip() {
    const lists = getListsMetadata();

    lists.forEach(function (list) {
        const { element, count, wip } = list;

        if (!isNaN(wip.min) && count <= wip.min) return highlightList(element, count, wip.min);
        if (!isNaN(wip.max) && count >= wip.max) return highlightList(element, count, wip.max);

        revertHighlightList(element);
    });
}

let validateLoadingCount = 0;

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
    if (request.action === "start") return new Promise(waitLoading).then(highlightListsWithWip);
    if (request.action === "update") return highlightListsWithWip();
});
