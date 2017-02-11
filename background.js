/*
	StandUp! - Reminds every x minutes to stand up and stretch.
    Copyright (C) 2017  Jan Kaiser

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/	

var alarm;
var openAlert = false;

function setDefaultIntervalStorage() {
	browser.storage.local.set({
		interval: 30
	});
}

function setDefaultJSAlertStorage() {
	browser.storage.local.set({
		jsAlert: false
	});
}

function initialize() {
	var interval = browser.storage.local.get("interval");
	interval.then(function (item) { //success
		if (!isNumber(item.interval)) {
			setDefaultIntervalStorage();
		}
	}, function (error) { //error
		console.log(error);
		setDefaultIntervalStorage();
	});


	var jsAlert = browser.storage.local.get("jsAlert");
	jsAlert.then(function (item) {
		if (!item.jsAlert) {
			setDefaultIntervalStorage();
		}
	}, function (error) {
		console.log(error);
		setDefaultIntervalStorage();
	});


	createAlarm();

	browser.runtime.onMessage.addListener(messageHandler);
}

function setAlarm(interval) {
	alarm = browser.alarms.create("StandUp", {
		delayInMinutes: Number(interval),
		periodInMinutes: Number(interval)
	});
	browser.alarms.onAlarm.addListener(handleAlarm);
}

function createAlarm() {
	browser.alarms.clear("StandUp").then(function (i) {
		console.log(i);
	});
	var interval;
	var intervalPromise = browser.storage.local.get("interval");
	intervalPromise.then(function (item) { //success
		if (!isNumber(item.interval)) {
			interval = 30;
		} else {
			interval = item.interval;
		}
		setAlarm(interval);
	}, function (error) { //error
		console.log(error);
		interval = 30;
		setAlarm(interval);
	});

}

function handleAlarm(alarmInfo) {
	browser.notifications.create("StandUpNotification", // string
		{
			"type": "basic",
			"iconUrl": browser.extension.getURL("icons/icon-96.png"),
			"title": "Time to stand up!",
			"message": "Show me your moves!"
		});
	var currentdate = new Date();
	console.log("on alarm " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ": " + alarmInfo.name);

	var jsAlert = browser.storage.local.get("jsAlert");
	if (!jsAlert || jsAlert === undefined) {
		jsAlert = false;
	}


	if (jsAlert) {
		if (!openAlert) {
			openAlert = true;
			try {
				browser.tabs.executeScript({
					file: "alert.js"
				});
			} catch (error) {
				console.log(error);
				openAlert = false;
				/*TODO: find a way to set openAlert to false when the active tab belongs to mozilla*/
			}
		}
	}

}

function messageHandler(message) {
	if (message === "settings") {
		createAlarm();
	} else {
		openAlert = false;
	}
}

function settingsListener(message) {
	console.log(message);
}

function isNumber(n) {
	return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

initialize();