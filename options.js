/**
 * Created by yingfu on 12/29/14.
 */
(function () {

    'use strict';

	var GD_URL = 'gd-new-entry-url';

	function saveOptions() {
		var url = document.getElementById('url').value;

		var data = {};
		data[GD_URL] = url;
		chrome.storage.sync.set(data, function() {
			var status = document.getElementById('status');
    		status.textContent = '已保存';
    		setTimeout(function() {
      			status.textContent = '';
    		}, 750);
	  	});
	}

	function restoreOptions() {
	  chrome.storage.sync.get(GD_URL, function(items) {
	    document.getElementById('url').value = items[GD_URL];
	  });
	}

	document.addEventListener('DOMContentLoaded', restoreOptions);
	document.getElementById('save').addEventListener('click', saveOptions);
}());