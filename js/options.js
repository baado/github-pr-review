const tokenStorageName = "github_review_token";

document.addEventListener('DOMContentLoaded', function () {
    const apiRoot = "https://api.github.com";
    document.querySelector('[name="token"]').value = localStorage.getItem(tokenStorageName);

    document.querySelector('[name="save"]').addEventListener('click', function (e) {
        localStorage.setItem(tokenStorageName, document.querySelector('[name="token"]').value);
        alert('saved');
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
