document.addEventListener('DOMContentLoaded', function () {
    const apiRoot = "https://api.github.com";
    var token;
    chrome.storage.local.get("github_review_token", function(item) {
        token = item.github_review_token;
        if (token) {
            document.querySelector('[name="token"]').value = token;
        }
    });

    document.querySelector('[name="save"]').addEventListener('click', function (e) {
        const token = document.querySelector('[name="token"]').value;
        chrome.storage.local.set({"github_review_token": token}, function() {
            alert('saved');
        });
    });
    document.querySelector('[name="test"]').addEventListener('click', function (e) {
    	const token = document.querySelector('[name="token"]').value;
        if (!token) {
            alert('please input');
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open("GET", apiRoot);
        xhr.setRequestHeader("Authorization", `token ${token}`);
        xhr.onload = function (e) {
            alert('connection ' + xhr.statusText + ': ' + xhr.responseText);
        };
        xhr.onerror = function (e) {
            alert('connection failed');
        };
        xhr.send();
    });
});
