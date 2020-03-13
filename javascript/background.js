function updateWip(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "update" });
}

(function () {
    chrome.webNavigation.onCompleted.addListener((details) => {
        if (details.url.startsWith("https://trello.com/b/")) updateWip(details.tabId);
    });

    chrome.webRequest.onCompleted.addListener((details) => {
        updateWip(details.tabId);
    }, {
        urls: [
            "https://trello.com/*/lists/*",
            "https://trello.com/*/lists",
            "https://trello.com/*/cards/*",
            "https://trello.com/*/cards"
        ]
    });
}());
