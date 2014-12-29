(function () {

    'use strict';


    var active = false;
    var frequency = 5 * 1000;
    var timeoutHandle;
    var currentTimestamp;

    var GD_URL = 'gd-new-entry-url';

    function handleResponse(response) {
        console.log('response got');
    }

    function requestGDNewEntry () {
        console.log('request to get new entry');

        chrome.storage.sync.get(GD_URL, function(items) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", items[GD_URL], true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    handleResponse(xhr.responseText);
                }
            }
            xhr.send();

            timeoutHandle = setTimeout(requestGDNewEntry, frequency);
        });
        
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


}());



























