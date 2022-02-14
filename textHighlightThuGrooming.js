// ==UserScript==
// @name        Text highlight (Thu grooming)
// @version      0.1
// @author       ld
// @match        redmine.tribepayments.com/issues/1*
// @match        redmine.tribepayments.com/issues/2*
// @match        redmine.tribepayments.com/issues/3*
// @match        redmine.tribepayments.com/issues/4*
// @match        redmine.tribepayments.com/issues/5*
// @match        redmine.tribepayments.com/issues/6*
// @match        redmine.tribepayments.com/issues/7*
// @match        redmine.tribepayments.com/issues/8*
// @match        redmine.tribepayments.com/issues/9*
// @description Highlights text within HTML
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// @grant    GM.getValue
// ==/UserScript==

'use strict';

let wordList = [
	'Review status',
	'Reports - tag',
	'Follow-up tag',
	'Estimated time',
	'Estimated AT %',
	'Post-release training',
	'Post-release announcement',
	'Business summary',
];

function highlightWord(word) {
	var xpath = "//text()[contains(., '" + word + "')]";
	var texts = document.evaluate(
		xpath,
		document.body,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	for (let n = 0; n < texts.snapshotLength; n++) {
		var textNode = texts.snapshotItem(n);
		var p = textNode.parentNode;
		var a = [];
		var frag = document.createDocumentFragment();
		textNode.nodeValue.split(word).forEach(function (text, i) {
			var node;
			if (i) {
				node = document.createElement('span');
				node.style.backgroundColor = 'yellow';
				node.appendChild(document.createTextNode(word));
				frag.appendChild(node);
			}
			if (text.length) {
				frag.appendChild(document.createTextNode(text));
			}
			return a;
		});
		p.replaceChild(frag, textNode);
	}
}

let today = new Date();
let todayBeforeMeet = new Date().setHours(15, 55); // (hours, minutes, seconds)
let todayAfterMeet = new Date().setHours(17, 5);
if (today.getDay() === 4) {
	if (today > todayBeforeMeet && today < todayAfterMeet) {
		// Parse through keyword list and highlight items
		wordList.forEach((element) => highlightWord(element));
	}
}

/*
// testing values:
console.log("todayBeforeMeet: " + new Date(todayBeforeMeet))
console.log("todayAfterMeet: " + new Date(todayAfterMeet))
console.log("today" + new Date(today))
*/
