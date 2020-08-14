function initializeWip(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "initialize" });
}

(function () {
    chrome.webRequest.onCompleted.addListener((details) => {
        initializeWip(details.tabId);
    }, {
        urls: [
            "https://trello.com/1/boards/*/markAsViewed",
        ]
    });
}());
