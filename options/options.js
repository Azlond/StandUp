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


function restoreOptions() {
	var interval = browser.storage.local.get("interval");
	interval.then(function (item) { //success
		if (!isNumber(item.interval)) {
			document.getElementById("intervalInput").value = 30;
		} else {
			document.getElementById("intervalInput").value = item.interval;
		}
	}, function (error) { //error
		document.getElementById("intervalInput").value = 30;
	});


	var jsAlert = browser.storage.local.get("jsAlert");
	jsAlert.then(function (item) {
		if (item.jsAlert) {
			document.getElementById("jsA").checked = item.jsAlert;
		}
	}, function (error) {
		console.log(error);
		document.getElementById("jsA").checked = false;
	});
}

function saveOptions(e) {

	e.preventDefault();
	var interval = document.getElementById("intervalInput").value;
	var jsAlert = document.getElementById("jsA").checked;
	if (!isNumber(interval)) {
		interval = 30;
	}
	browser.storage.local.set({
		interval: interval
	});
	browser.storage.local.set({
		jsAlert: document.getElementById("jsA").checked
	});
	browser.runtime.sendMessage("settings");
}

function isNumber(n) {
	return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("submitButton").addEventListener("click", saveOptions);
