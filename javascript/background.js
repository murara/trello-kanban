(function () {
    const networkFilters = {
        urls: [
            "https://trello.com/*/lists/*",
            "https://trello.com/*/lists",
            "https://trello.com/*/cards/*",
            "https://trello.com/*/cards"
        ]
    };

    chrome.webRequest.onCompleted.addListener((details) => {
        chrome.tabs.sendMessage(details.tabId, { action: "update" });
    }, networkFilters);
}());
