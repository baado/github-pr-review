
var token;

chrome.extension.sendMessage({type: "initialise"}, function(response) {
	PrExpander.Initialise();
});

var PrExpander = {};
(function(PrExpander) {
    const requestIcon = '<svg aria-hidden="true" class="octicon octicon-primitive-dot bg-pending" height="16" version="1.1" viewBox="0 0 8 16" width="8"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>';
    const commentIcon = '<svg aria-hidden="true" class="octicon octicon-comment text-gray" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"></path></svg>';
    const apiRoot = "https://api.github.com";

    PrExpander.Initialise = function() {
        chrome.storage.local.get("github_review_token", function(item) {
            token = item.github_review_token;
            [].forEach.call(document.querySelectorAll('.js-navigation-container.js-active-navigation-container li'), function(entry) { 
                var url = entry.getElementsByClassName('js-navigation-open')[0].href;
                const [_, owner, repo, issueNum] = /^https?:\/\/[^\/]+\/([^\/]+)\/([^\/]+)\/pull\/(\d+)\b/.exec(url);
                fetchReviews(owner, repo, issueNum, entry);
                fetchReviewRequests(owner, repo, issueNum, entry);
            });
        });
    };

    function addLabelContainerIfNeeded(entry) {
        const node = entry.getElementsByClassName('labels')[0];
        if (!node) {
            const labelNode = document.createElement('span');
            labelNode.classList.add('labels');
            const middleNode = entry.getElementsByClassName('col-9')[0];
            middleNode.insertBefore(labelNode, middleNode.getElementsByClassName('mt-1')[0]);
        }
    }

    function fetchGitHubApi(path, entry) {
        return new Promise((ok, ng) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${apiRoot}/${path}`);
            if (token) {
                xhr.setRequestHeader("Authorization", `token ${token}`);
            }
            xhr.onload = function (e) {
                if (xhr.status >= 400) {
                    ok();
                }
                else {
                    var data = { entry: entry, json: JSON.parse(xhr.responseText) };
                    ok(data);
                }
            };
            xhr.onerror = function (e) { ng(e); };
            xhr.send();
        });
    }

    function fetchReviews(owner, repo, issueNum, entry) {
        fetchGitHubApi(`repos/${owner}/${repo}/pulls/${issueNum}/reviews`, entry)
            .then(arg => {
                addLabelContainerIfNeeded(arg.entry);
                const node = arg.entry.getElementsByClassName('labels')[0];

                var persons = [];
                arg.json.forEach(function(comment){
                    if (comment.state !== "APPROVED" && !persons.includes(comment.user.login)) {
                        var userHtml = `<span style="padding:.3em;">${commentIcon}<a href="${comment.user.html_url}">${comment.user.login}</a></span>`;
                        node.innerHTML = node.innerHTML + userHtml;
                        persons.push(comment.user.login);
                    }
                });
            });
    }

    function fetchReviewRequests(owner, repo, issueNum, entry) {
        fetchGitHubApi(`repos/${owner}/${repo}/pulls/${issueNum}/requested_reviewers`, entry)
            .then(arg => {
                addLabelContainerIfNeeded(arg.entry);
                const node = arg.entry.getElementsByClassName('labels')[0];

                arg.json.forEach(function(person){
                    var userHtml = `<span style="padding:.3em;">${requestIcon}<a href="${person.html_url}">${person.login}</a></span>`;
                    node.innerHTML = node.innerHTML + userHtml;
                });
            });
    }
})(PrExpander);
