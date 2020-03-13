const wipRegex = /\[(\d)?-?(\d)\]/g;

function findColumns() {
    return Array.from(document.querySelectorAll('div.list'));
}

function countColumnCards(column) {
    return column.querySelectorAll('a.list-card').length;
}

function getColumnTitle(column) {
    return column.querySelector('.list-header h2.list-header-name-assist').innerText;
}

function buildColumnMetada(column) {
    const title = getColumnTitle(column);
    const wipSearchResult = wipRegex.exec(title);

    if (!wipSearchResult) return false;

    return {
        element: column,
        count: countColumnCards(column),
        wip: {
            min: parseInt(wipSearchResult[1]),
            max: parseInt(wipSearchResult[2])
        }
    };
}

function getColumnsMetadata() {
    const columns = findColumns();
    return columns.reduce(function (filteredColumns, currentColumn) {
        const columnMetadata = buildColumnMetada(currentColumn);

        if (columnMetadata) filteredColumns.push(columnMetadata);

        return filteredColumns;
    }, []);
}

function highlightColumnWithYellow(column) {
    column.style.backgroundColor = 'yellow';
}

function highlightColumnWithRed(column) {
    column.style.backgroundColor = 'red';
}

function revertHighlightColumn(column) {
    column.style.backgroundColor = '';
}

function highlightColumn(column, count, limit) {
    if (count === limit) highlightColumnWithYellow(column)
    else highlightColumnWithRed(column)
}

function highlightColumnsWithWip() {
    const columns = getColumnsMetadata();

    columns.forEach(function (column) {
        const { element, count, wip } = column;

        if (!isNaN(wip.min) && count <= wip.min) return highlightColumn(element, count, wip.min);
        if (!isNaN(wip.max) && count >= wip.max) return highlightColumn(element, count, wip.max);

        revertHighlightColumn(element);
    });
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "update") return highlightColumnsWithWip();
});
