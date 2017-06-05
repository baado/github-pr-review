var _tabUrl;
var _changeInfo;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url && tab.url.match(/^https:\/\/github\.com\/.+\/(pulls|milestone)/)) {
        if (changeInfo.status === 'loading') {
            _tabUrl = tab.url;
            _changeInfo = changeInfo;
        }
        if (changeInfo.status === 'complete') {
            if (_changeInfo.status === 'loading' && _tabUrl == tab.url) {
                chrome.tabs.executeScript(tab.id, { file: "js/base.js" });
                _tabUrl = tab.url;
                _changeInfo = changeInfo;
            }
        }
    }
});
