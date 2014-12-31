(function () {

    'use strict';


    var active = false;
    var frequency = 60 * 1000;
    var timeoutHandle;
    var currentTimestamp;

    var GD_URL_KEY = 'gd-new-entry-url';

    var GD_HOST = 'https://jinshuju.net/';
    var GD_NOTIFICATION_URL = GD_HOST + 'notifications/summary';

    function showNotification(icon, title, body, url) {
        var options = {
            type: 'basic',
            title: title,
            message: body,
            iconUrl: icon
        };
        chrome.notifications.create(url, options, messageCallback);
    }

    function messageCallback (notificationId) {

    }

    function handleResponse(response) {
        var tmpContainer = document.createElement("div");
        tmpContainer.innerHTML = response;
        var tmpFragment = document.createDocumentFragment();
        while (i = tmpContainer.firstChild) tmpFragment.appendChild(i);
        window.tmpFragment = tmpFragment;
        var list = tmpFragment.firstChild.children;
        for(var i = 0; i < list.length; i+= 1) {
            var content = list[i].textContent;
            if (content.indexOf('新增') > -1) {
                var elements = list[i].children;
                var entriesUrl = GD_HOST + elements[1].getAttribute('href');
                showNotification('images/new_entry.png', '新数据', content, entriesUrl);
            }
        }
    }

    function sendRequest(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 && !/html/.test(xhr.responseText)) {
                handleResponse(xhr.responseText);
            }
        };
        xhr.send();

        timeoutHandle = setTimeout(requestGDNewEntry, frequency);
    }

    function requestGDNewEntry () {
//        chrome.storage.sync.get(GD_URL_KEY, function(items) {
//            sendRequest(items[GD_URL_KEY]);
//        });
        sendRequest(GD_NOTIFICATION_URL);
    }


    function start () {
        currentTimestamp = Math.round((new Date().getTime()) / 1000) - (12 * 3600);
        chrome.notifications.onClicked.addListener(function(notificationId) {
            window.open(notificationId);
        });
        requestGDNewEntry();
    }


    function stop () {
        clearTimeout(timeoutHandle);
    }

    chrome.browserAction.onClicked.addListener(function () {

        active = ! active;

        if (active) {
            chrome.browserAction.setBadgeBackgroundColor({ 'color': [0, 200, 0, 200] });
            chrome.browserAction.setBadgeText({ 'text': 'on' });
            start();
        } else {
            chrome.browserAction.setBadgeText({ 'text': '' });
            stop();
        }
    });


}());



























