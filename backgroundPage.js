(function () {

    'use strict';

    var active = false;
    var frequency = 60 * 1000;
    var timeoutHandle;
    var currentTimestamp;

    var GD_HOST = 'https://jinshuju.net/';
    var GD_NOTIFICATION_URL = GD_HOST + 'notifications/summary';

    var icons = {
      newEntry: 'images/new_entry.png',
      default: 'images/message.png'
    };

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

    function notificationOptions (content) {
        if (content.indexOf('新增了') > -1) {
            return {title: '新数据', icon: icons.newEntry, linkIndex: 1};
        }

        if (content.indexOf('向你分享了表单') > -1) {
            return {title: '分享表单', icon: icons.default};
        }

        if (content.indexOf('数据推送失败') > -1) {
            return {title: '数据推送失败', icon: icons.default};
        }

        if (content.indexOf('您提交的模板') > -1) {
            return {title: '模板审核', icon: icons.default};
        }
        return {title: '新消息', icon: icons.default};
    }

    function handleResponse(response) {
        var tmpContainer = document.createElement("div");
        tmpContainer.innerHTML = response;
        var tmpFragment = document.createDocumentFragment();
        while (i = tmpContainer.firstChild) tmpFragment.appendChild(i);
        var list = tmpFragment.firstChild.children;

        for(var i = 0; i < list.length; i+= 1) {
            var content = list[i].textContent.trim();
            var options = notificationOptions(content);
            var url = GD_HOST + list[i].children[options.linkIndex || 0].getAttribute('href');
            showNotification(options.icon, options.title, content, url);
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
        sendRequest(GD_NOTIFICATION_URL);
    }

    function start () {
        currentTimestamp = Math.round((new Date().getTime()) / 1000) - (12 * 3600);
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

    chrome.notifications.onClicked.addListener(function(notificationId) {
        window.open(notificationId);
    });

}());



























