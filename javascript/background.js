function startWip(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "start" });
}

function updateWip(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "update" });
}

(function () {
    chrome.webNavigation.onCompleted.addListener((details) => {
        if (details.url.startsWith("https://trello.com/b/")) startWip(details.tabId);
    });

    chrome.webRequest.onCompleted.addListener((details) => {
        updateWip(details.tabId);
    }, {
        urls: [
            "https://trello.com/*/lists/*",
            "https://trello.com/*/lists",
            "https://trello.com/*/card/*"
        ]
    });
}());
