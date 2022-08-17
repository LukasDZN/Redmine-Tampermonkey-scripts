// ==UserScript==
// @name         TribeRedmineUI
// @version      0.1
// @author       ld
// @match        redmine.tribepayments.com/*
// @grant        GM_addStyle
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/Task%20UI%20improvements.user.js
// @updateURL    https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/Task%20UI%20improvements.user.js
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.js
// ==/UserScript==

/* Notes */

/*
TODO:
- [DONE] Center the modal window
- [DONE] Move the close X button to the right corner
- [DONE] Make a list of possible config statuses
- [DONE] Add config statuses
- [DONE] Implement check mark indicating that the setting is active --> Add toggles for each config status
- [DONE] Resize the slider
- [DONE] Display the toggles next to the description instead of below it
- [DONE] Finalize module design
- [DONE] Add a scrollbar because the list is too long

- [DONE] Add nested config statuses -> alternative was done without nesting - simply a menu category
- [DONE] Created automatic button insert according to available statuses

Settings content changes depending on which page you're on.
Can't know your support statuses list without being on the page or at least having visited it once since installing.
Once a user goes to the support ticket page, statuses will be parsed and saved.
To make sure a user never sees an empty config page for statuses - a fetch request could be made.
If settings change per page - it can be difficult to understand what kind of settings exist overall.
Instruct the user to go to a task issue page to set the setting. (if no status is found -> display instruction text / or if no status is found - send a fetch request [implement if it's easy])
Where should the settings button exist in general? Top right corner in all pages? -> yes.
What if a new status is added or removed?
It can either be checked periodically every day or just run the function at the end of the script to reduce processing time.
It should be disabled by default.

- [DONE] Change settings button position
- [DONE] Make support buttons automatically appear in the config module
- [DONE] Save and change config statuses to local storage using sliders
- [DONE] Add a "Save" button (which closes the modal window upon clicking) -> no need for a button now.
- [DONE] Refactoring button code - making it a separate function instead of two blocks of code

- This should load for every page. Functions should be separated by page regex match.
- This should also work on pages such as time logging.

- [DONE] Update DOM after adding a new button
- [DONE] Add a "Toggle config mode" button and make it functional.
- [DONE] Detect form reset / page reload

- [DONE] Parse through the noted types of fields (during New/Edit/Copy actions)
- [DONE] Add a save button (after each div) (it shouldn't be very visible, maybe small and gray)
- [DONE] When clicked -> it saves field name and value
	- [DONE] A button appears with that text
- [DONE] Value is displayed as a button -> use previous code
- There's a 'primary' checkmark -> if an item is marked as primary, it will load each time for all projects.
- [DONE] There's a delete button that deletes it from localStorage and removes the button from DOM
- [DONE] Save and X to remove existing field pre-set when Creating / Editing / Copying a task.

- https://redmine.tribepayments.com/issues/73347 -> handle errors somehow. If status cannot be changed it's okay that the buttons do not load. Just handle the error.
- Enable setting toggle for all other functions
- Note disappears when clicking "Hide"
- Bug: Note not rendering images properly. Change note design to white.
- Add Redmine task field templating (option to select primary / add current / delete icon)
- Add Redmine task templating (option to select primary / add current / delete icon)
- Feature: Create a slider for task progress
- [DONE] Architecture refactoring
- Feature: Load last note draft.
- Feature: Custom query filtering
- Load settings after the rest of the page has loaded to avoid reducing page load time

Unrealistic goals:
- Dark mode and modern redesign - Discord inspired.

Add a settings dropdown menu to the settings icon
https://www.w3schools.com/howto/howto_js_dropdown.asp

*/

/* CSS */

GM_addStyle(`



/* Task description and notes */

div.wiki {
	/*font-family: 'Roboto', sans-serif;*/
	font-size: 15px;
	border-radius: 10px;
	box-shadow: rgba(6, 24, 44, 0.2) 0px 0px 0px 2px, rgba(6, 24, 44, 0.45) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset !important;
	background-color: white;
	padding-left: 14px !important;
	padding-right: 14px !important;
	padding-top: 8px !important;
	padding-bottom: 8px !important;
	margin-top: 12px !important;
	margin-bottom: 12px !important;
	margin-left: 6px !important;
	margin-right: 6px !important;
}

/* MR div */
div.cf_25.attribute > div.value > div {
	box-shadow: unset !important;
	/* background-color: ; */
}

/* Page Global CSS */
.tab-content {
	border: none !important;
}

#footer {
	border-top: none !important;
	color: white !important;
}

#footer > a {
	color: white !important;
}

/*
input {
	font-family: Inter, "Helvetica Neue", Helvetica, sans-serif;
	background-color: #80cc74;
}
*/

p {
	margin-top: 10px !important;
	margin-bottom: 10px !important;
}

/* Top bar of the whole page that is initially blue */
/* div#header {
	background-color: blue;
}*/



/* Settings modal */

/* The Modal (background) */
.settingsModal {
	display: none; /* Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	padding-top: 100px; /* Location of the box */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0,0,0); /* Fallback color */
	background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
	margin-left: 0!important; /* Remove the margin otherwise there's a gap */
}

/* settingsModal Content */
.settingsModalContentClass {
	background-color: #fefefe;
	color: #000;
	margin: auto;
	padding: 2.5rem;
	border: 1px solid #888;
	width: fit-content;
	border-radius: 6px;
	font-family: Inter, sans-serif;
	height: auto;
	margin-bottom: 20%;
	overflow: auto;
}

/* The Close Button */
.close {
	color: #aaaaaa;
	float: right;
	font-size: 28px;
	font-weight: bold;
}

.close:hover,
	.close:focus {
	color: #000;
	text-decoration: none;
	cursor: pointer;
}


/* Settings modal content */

/* settingDiv */
.settingConfigDiv {
	margin-top: 10px;
	margin-bottom: 10px;
	align-items: center;
}

.gridWrapper {
	display: grid;
	grid-template-columns: 60% 40%;
}

p {
	color: #000000;
	font-size: 14px;
}

#settingsModalId > div > hr {
	margin-top: 14px;
	margin-bottom: 28px;
}

#settingsModalId > div > h1 {
	margin-top: 18px!important;
	margin-bottom: 26px!important;
	font-size: 28px!important;
}

#settingsModalId > div > h2 {
	margin-top: 16px!important;
	margin-bottom: 18px!important;
	font-size: 22px!important;
}

#settingsModalId > div > h3 {
	margin-top: 18px!important;
	margin-bottom: 16px!important;
	font-size: 18px!important;
}

.switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
	transform: scale(0.8);
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: .4s;
	transition: .4s;
	transform: scale(0.8);
}

.slider:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: .4s;
	transition: .4s;
}

input:checked + .slider {
	background-color: #00C853;
}

input:focus + .slider {
	box-shadow: 0 0 1px #00C853;
}

input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
	border-radius: 34px;
}

.slider.round:before {
	border-radius: 50%;
}

.alertBox {
	position: relative;
	padding: 0.75rem 1.25rem;
	padding-left: 1rem;
	padding-top: 0.35rem;
	padding-bottom: 0.75rem;
	margin-bottom: 1rem;
	border: 1px solid transparent;
	border-radius: 0.3rem;
	color: #023164;
	   background-color: #cce5ff;
	border-color: #b8daff;
	font-size: 14px;
}

.alertBox > span {
	font-size: 1.8em;
}

.paramSaveFillPlus {
	background-color: #e7ffd4;
}



/* Buttons */

/* optional - add  "input[type="submit"]' as a selector below in order to style the submit button */
.fill, input[type="submit"]{
	font-family: "Inter", sans-serif!important;
	font-size: 12px;
	font-weight: 600;
	line-height: 1.15;
	background-color: #e1ecf4;
	border-radius: 5px;
	border: 1px solid transparent;
	box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
	box-sizing: border-box;
	color: #0d3d61;
	cursor: pointer;
	display: inline-block;
	margin: 2px;
	padding: 8px 4px;
	outline: none;
	position: relative;
	text-align: center;
	text-decoration: none;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
	vertical-align: middle;
	white-space: nowrap;
	box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.03);
}

.fill:hover,
.fill:focus {
	/* color: #2c5777;
	text-decoration: none;
	box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25); */
	filter: brightness(76%) contrast(190%);
	text-decoration: none;
	color: #0d3d61;
	/* -webkit-text-stroke: 0.03vw #0d3d61; */
}

.paramSaveFill {
	min-width: 20px;
	padding: 0px 4px;
	font-weight: bold;
}

/* Edit button */
a.icon.icon-edit.fill {
	background-color: #4D75B2;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 20px;
	padding-right: 20px;
	color: white;
}

/* Submit button */
input[type="submit"] {
	text-align: center;
	font-size: 12px;
	font-weight: 600;
	background-color: #05DCA2;
	padding-top: 8px;
	padding-bottom: 12px;
	padding-left: 20px;
	padding-right: 20px;
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 10px;
	margin-right: 10px;
	min-width: 70px;
	min-height: 30px;
	color: white;
}

input[type="submit"]:hover {
	background-color: #05DCA2;
	text-decoration: none;
	box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
}



/* Template buttons */

/* X delete symbol after each template content button */
.paramTemplateBtnFill {
	padding-left: 0.4rem;
}

.deleteParamTemplateBtnFill {
	color: #C70039;
	font-size: 0.8em;
	margin-left: 0;
	padding: 0.3rem;
	margin-right: 0.6rem;
	font-weight: 100;
	border: none;
	background-color: transparent;
	cursor: pointer;
}

.deleteParamTemplateBtnFill:hover {
	background-color: #e8d6dc;
}



/* Text editor */

.descriptionArea {
	word-wrap: normal !important;
	white-space: pre-wrap !important;
	background-color: #fff !important;
	}

h2 {
	font-size: 18px !important;
}

.fontsize16 {
	font-size: 16px !important;
	height: 400px !important;
}



/* Copy task hyperlink */
#content > h2 {
	cursor: pointer;
}

#content > h2:after {
	padding-left: 6px;
	padding-top: 4px;
	cursor: pointer;
	/* content: "❐"; */
	font-size: 1em;
	color: #0d3d61;
}

#content > h2:hover, #content > h2:hover:after {
	color: #377FB4;
}

#content > h2:active, #content > h2:active:after {
	color: #82e0aa;
}



/* Search bar */

.searchLength {
	width: 50vw !important;
}



/* Progress bar */

.progressBar {
	width: 10em;
	height: 0.5em;
	background: repeating-linear-gradient(
		to right,
		#ddd,
		#ddd 4%,
		transparent 4%,
		transparent 5%
	  ),
	  repeating-linear-gradient(
		to right,
		green,
		green 8%,
		transparent 8%,
		transparent 10%
	  );
  
	background-size: 200%, 100%;
	background-position: -100%;
	background-repeat: repeat-y;
}



/* Misc */

.contextual {
	color: white;
}

`);

/* Imports */

var $ = window.jQuery;

// Button color regex (from Tampermonkey convenience script)
var statusColorPatterns = {
	'^Pending Approval$': '#fcf3cf',
	'^Not Approved$': '#eafaf1',
	'^New$': '#82e0aa',
	'^In Progress.*': '#f7db6f',
	'^Resolved$': '#85c1e9',
	'^Feedback$': '#ec7063',
	'^Closed$': '#d5d8dc',
	'^Rejected$': '#abb2b9',
	'^Suspended$': '#fdedec',
	'^Pending.*': '#f7f2dc',
};

/* Constants */

const redmineTaskFieldIdsString = `
	#all_attributes input[type="text"],
	#all_attributes input[type="date"],
	#all_attributes input[type="checkbox"],
	#all_attributes select,
	#all_attributes textarea
	`;
const currentPageUrl = window.location.href;

/* Helper functions */

function formRefreshWatcher() {
	setTimeout(function () {
		// targetNode is created with a slight delay on page load and might not be found
		// Select the node that will be observed for mutations
		const targetNode = document.querySelector('.ui-autocomplete');
		// Options for the observer (which mutations to observe)
		const config = { attributes: true };
		// Callback function to execute when mutations are observed
		const callback = () => {
			parseTaskFieldsAndAddTemplateButtons();
			formRefreshWatcher();
		};
		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);
		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
	}, 100);
}

// // Detect project
// let taskTitle = $('head > title').text().slice(-28);
// var taskType;
// if (taskTitle.includes('Support - ')) {
// 	taskType = 'Support';
// } else {
// 	taskType = 'Development';
// }

// User ID
// var myUserLink = $('#loggedas a').attr('href');
// var myID = myUserLink.match(/(\d*)$/i)[0];

/* Button functions */

/* Edit buttons */

// Prettify the Edit button
try {
	$('#content > div:nth-child(1) > a.icon.icon-edit').addClass('fill');
} catch (error) {
	console.log("Couldn't prettify the Edit button");
}

// Prettify the bottom of the page Edit button
try {
	$('#content > div:nth-child(6) > a.icon.icon-edit').addClass('fill');
} catch (error) {
	console.log("Couldn't prettify the Edit button");
}

function addStatusButton(htmlColorCodeWithHashtag, buttonText, statusId) {
	// Identify div to add the button to
	let topHorizontalToolbar = document.querySelector('#content > h2');
	const quickButtonId = `quickButtonId${statusId}`;
	let btn = `<a class="fill" id="${quickButtonId}" style="background-color:${htmlColorCodeWithHashtag}!important">${buttonText}</a>`;
	topHorizontalToolbar.insertAdjacentHTML('afterend', btn);
	document
		.querySelector(`#${quickButtonId}`)
		.addEventListener('click', function () {
			document.querySelector('#issue_status_id').value = statusId;
			document.querySelector('#issue-form').submit();
		});
}

function addQuickButtons(issueFieldId) {
	let issueStatusTextAndValueDOMObject =
		createRedmineEditFieldValueAndTextObject(issueFieldId);
	const issueFieldValue = document.querySelector(issueFieldId).value;
	for (let [key, value] of Object.entries(issueStatusTextAndValueDOMObject)) {
		// Map colors to status values
		let currentButtonColor = ''; // Default button color if no color is found
		for (let [string, color] of Object.entries(statusColorPatterns)) {
			if (value.match(new RegExp(string, 'i'))) {
				currentButtonColor = color;
				break;
			}
		}
		if (localStorage.getItem(key) === 'Active' && issueFieldValue !== key) {
			addStatusButton(currentButtonColor, value, key);
		}
	}
}

function createAndAddHyperlinkCopyButton() {
	// Identify div to add the button to
	let taskName = document.querySelector('#content > h2');

	// Preparing content to write to clipboard
	let taskTitle = document.querySelector('head > title').text.slice(0, -17); // Turn header element into text, then remove " - TribePayments" part of the string
	// Remove the " - <Project name>" from the end of the string
	let cleanedStringEndingIndex = taskTitle.lastIndexOf(' - ');
	let cleanedTaskTitle = taskTitle.substring(0, cleanedStringEndingIndex);
	// Create a hyperlink
	$('#footer').append(
		`<a href="${currentPageUrl}" style="color: white">${cleanedTaskTitle}</a>`
	);
	// This is a working solution that copies a hyperlink | Source: https://stackoverflow.com/questions/53003980/how-to-copy-a-hypertext-link-into-clipboard-with-javascript-and-preserve-its-lin
	const onClick = evt => {
		const link = document.querySelector('#footer > a:nth-child(2)'); // select hyperlink to copy from DOM
		const range = document.createRange();
		range.selectNode(link);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		document.execCommand('copy'); // deprecated but still works
		// navigator.clipboard.writeText(); --> for future use (and should be added to button onclick function)
	};
	taskName.addEventListener('click', function () {
		// navigator.clipboard.writeText(link)
		onClick();
	});
}

function createTemplateButton(redmineTaskFieldId, redmineTaskFieldValue, createdBy) {
	const taskFieldHtmlElement = document.getElementById(redmineTaskFieldId);
	const taskTemplateButtonId = 'paramSaveTemplateButton' + redmineTaskFieldId;
	// Preparing button values - truncating if the value is too long
	const redmineTaskFieldValueMaxLength = 55;
	let redmineTaskFieldValueTruncated = redmineTaskFieldValue;
	if (redmineTaskFieldValue.length > redmineTaskFieldValueMaxLength) {
		redmineTaskFieldValueTruncated =
			redmineTaskFieldValue.substring(0, 55) + '...';
	}
	// Insert a template button (without click action)
	if (createdBy === "newlyInjectedButtonByPressingPlus") {
		display = "inline-block";
	} else if (createdBy === "loadedOnPageRender") {
		display = "none";
	}
	const deleteParamTemplateBtnId =
		'deleteParamTemplateBtn' + redmineTaskFieldId;
	let templateButtonHtml = `<button type="button" title="${redmineTaskFieldValue}" class="fill paramSaveFill paramTemplateBtnFill" id="${taskTemplateButtonId}" value="${redmineTaskFieldValue}">${redmineTaskFieldValueTruncated}</button><button style="display: ${display};" type="button" class="deleteParamTemplateBtnFill hiddenByDefault" id="${deleteParamTemplateBtnId}">✖</button>`;
	taskFieldHtmlElement.insertAdjacentHTML('afterend', templateButtonHtml);
	// Add click action for the button
	const thisTemplateButtonElement =
		document.getElementById(taskTemplateButtonId);
	thisTemplateButtonElement.addEventListener('click', function () {
		document.getElementById(redmineTaskFieldId).value = this.value;
	});
	// Add click action for the X delete button
	document
		.getElementById(deleteParamTemplateBtnId)
		.addEventListener('click', function () {
			let currentValue = localStorage.getItem(redmineTaskFieldId); // possible value: "['some', 'value', 'here']"
			let parsedValue = JSON.parse(currentValue);
			let index = parsedValue.indexOf(this.value); // removes this value from the array
			parsedValue.splice(index, 1);
			localStorage.setItem(
				redmineTaskFieldId,
				JSON.stringify(parsedValue)
			);
			this.remove(); // removes the X button
			thisTemplateButtonElement.remove(); // removes the template button
		});
}

function addToggleConfigModeButton(pageName) {
	let contentDivElement;
	if (pageName === 'taskDetailsPage') {
		contentDivElement = document.querySelector('#update > h3');
	} else if (pageName === 'newPage') {
		contentDivElement = document.querySelector('#content > h2');
	}
	const newIssueConfigToggleBtn = `<button type="button" class="fill paramSaveFill" id="newIssueConfigToggleBtnId">Toggle config mode</button>`;
	contentDivElement.insertAdjacentHTML('afterend', newIssueConfigToggleBtn);
	const thisNewIssueConfigToggleBtnId = document.getElementById(
		'newIssueConfigToggleBtnId'
	);
	thisNewIssueConfigToggleBtnId.addEventListener('click', function () {
		document.querySelectorAll('.hiddenByDefault').forEach(function (item) {
			try {
				item.style.display =
					item.style.display === 'none' ? 'inline-block' : 'none';
			} catch (error) {
				console.log(error);
			}
		});
	});
}

/* Task content (description, notes) */

$(
	'#content > div.issue.tracker-19.status-5.priority-3.priority-high3.closed.created-by-me.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_25.attribute > div.value > div'
).addClass('mrDiv');

/* REMOVING UI ELEMENTS */

let removeClassesList = [
	'.icon-comment',
	'.next-prev-links',
	'#content > p',
	'#add_to_important_list',
	'icon-fav-off',
	// '#sidebar',
];
removeClassesList.forEach(className =>
	document.querySelectorAll(className).forEach(e => e.remove())
);

document.querySelectorAll('#add_to_important_list').forEach(e => e.remove());

/* Task status background highlight */

function taskStatusBackgroundHighlight() {
	// Map colors to status values
	let highlightColor = ''; // Default button color if no color is found
	const statusElement = document.querySelector(
		'div.status.attribute > div.value'
	);
	const statusValue = statusElement.textContent;
	for (let [string, color] of Object.entries(statusColorPatterns)) {
		if (statusValue.match(new RegExp(string, 'i'))) {
			highlightColor = color;
			break;
		}
	}
	// Replace status text with styled content
	statusElement.innerHTML = `<span style="background-color: ${highlightColor}; padding-left: 1em; padding-right: 1em; border-radius: 3px;">${statusValue}</span>`;
}

/* Priority visualization */

const priorityNameAndColorObject = {
	"Very low": '#E5E4E2',
	"Low": '#ACCFF3',
	"Normal": '#72CB57',
	"High": '#F6BC00',
	"Urgent": '#FF5733',
	"Immediate": '#900C3F',
};

function priorityVisualization() {
	let highlightColor = ''; // Default button color if no color is found
	const priorityElement = document.querySelector('div.priority.attribute > div.value');
	const priorityValue = priorityElement.textContent;
	for (let [string, color] of Object.entries(priorityNameAndColorObject)) {
		if (priorityValue === string) {
			highlightColor = color;
			break;
		}
	}
	// Replace priority text with styled content
	priorityElement.innerHTML = `<span>${priorityValue}</span><span style="color: ${highlightColor}; font-size: 1.4em; ">&nbsp;&#x2776;</span>`;
}

/* Sticky note text editor */

function addStickyNoteTextEditor() {
	GM_addStyle(`

	/* This is the outer part of the Note text box*/
	.stickyNotes {
		position: fixed !important;
		bottom: 0 !important;
		right: 20px !important;
		min-width: 800px !important;
		max-width: 1600px !important;
		width: 40vw !important;
		background: #283747 !important;
		border-radius: 10px !important;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset !important;
	}

	textarea#issue_notes {
		font-size: 1.3em;
		font-family: Inter, "Helvetica Neue", Helvetica, sans-serif !important;
	}

	/* Set 'Private notes' text to be white (because it's on black background). */
	fieldset.stickyNotes {
		color: #fff !important;
	}

	`);

	GM_addStyle(`

	.showButton {
		position: fixed;
		bottom: 0;
		background-color: #283747;
		color: white;
		border-radius: 10px;
		min-width: 100px;
		min-height: 30px;
		font-family: Inter, "Helvetica Neue", Helvetica, sans-serif;
	}

	.showButton:hover {
		background-color: #283747;
		box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
	}

	`);

	// --- Add Note text area --------------------------------------------------------

	$('#issue-form > div > fieldset:nth-child(3)').addClass('stickyNotes');

	// Dealing with Textarea Height
	function calcHeight(value) {
		let numberOfLineBreaks = (value.match(/\n/g) || []).length;
		// min-height + lines x line-height
		let newHeight = numberOfLineBreaks * 20; // Change the first number to adjust the initial height
		if (newHeight > 850) {
			newHeight = 850;
		}
		if (newHeight < 200) {
			newHeight = 200;
		}
		return newHeight;
	}

	let textArea = document.querySelector('#issue_notes'); // select the text note inner field

	// Initial height
	$('#issue_notes').val('\n\n\n\n\n\n'); // Populate the text area with newlines
	$('textarea').prop('selectionEnd', 1); // text-cursor position (2nd line from the top)
	textArea.style.height = calcHeight(textArea.value) + 'px';

	// Constantly recalculating the height & Saving the textarea value to local storage
	textArea.addEventListener('keyup', () => {
		textArea.style.height = calcHeight(textArea.value) + 'px';
		saveNoteToLocalStorage();
	});

	// Remove the "Notes" title from textbox top
	document
		.querySelector('#issue-form > div > fieldset.stickyNotes > legend')
		.remove();

	// --- Add a submit button to the Note area ---------------------------------------

	$(function noteSubmitButton() {
		// Identify div to add the button to
		let noteArea = $('.stickyNotes');

		// a button is equal to
		let btn = $(
			'<input type="submit" name="commit" value="Submit" data-disable-with="Submit">'
		);
		// a button's on-click action is
		btn.click(function () {
			clearNoteFromLocalStorage();
			$('#issue-form').submit();
		});
		// Add the button
		noteArea.append(btn);
	});

	// --- Save note content to Local Storage ------------------------------------------

	var RedmineTaskNumber = window.location.href
		.split('/issues/')[1]
		.substring(0, 5);

	// Set Item
	/* localStorage.setItem(key, value); */
	function saveNoteToLocalStorage() {
		localStorage.setItem(
			RedmineTaskNumber,
			document.querySelector('#issue_notes').value
		);
	}

	// Retrieve
	/* let lastname = localStorage.getItem(key); */
	// On-load --> set the textarea to the last saved value
	document.querySelector('#issue_notes').value =
		localStorage.getItem(RedmineTaskNumber);

	// Local storage for this particular page is cleared upon clicking "Submit"
	function clearNoteFromLocalStorage() {
		localStorage.removeItem(RedmineTaskNumber);
	}

	// Add the clearNoteFromLocalStorage function to the submit buttons
	try {
		document
			.querySelector('#issue-form > input[type=submit]:nth-child(7)')
			.addEventListener('click', function () {
				clearNoteFromLocalStorage();
			}); // Clear local storage when clicking "Submit" }
	} catch (e) {
		document
			.querySelector('#issue-form > input[type=submit]:nth-child(7)')
			.addEventListener('click', function () {
				clearNoteFromLocalStorage();
			}); // Clear local storage when clicking "Submit"}
	}

	// --- Add a hide button to the Note area ------------------------------------------
	/**
	 * Note hide button
	 */

	GM_addStyle(`

	.hideButton {
		margin-left: 5px !important;
	}

	`);

	$(function noteHide() {
		// Identify div to add the button to
		let noteArea = $('.stickyNotes');

		// a button is equal to
		let btnHide = $(
			'<input type="button" class="hideButton" value="Hide">'
		);

		// "Hide" button's onClick action
		function hideNote() {
			// onClick -> Hide the text area
			$('#issue-form > div > fieldset.stickyNotes').hide();
			$('#footer > input:nth-child(5)').hide();

			// Add "Show note" button
			$(function unhideNote() {
				let minimizedBtn = $(
					'<input type="button" class="showButton Resolved" value="Show note">'
				);
				// a button's on-click action is
				minimizedBtn.click(function () {
					$('#issue-form > div > fieldset.stickyNotes').show();
					$('#footer > input').hide();
				});

				// Add the button
				$('div#footer').append(minimizedBtn);
			});
		}
		hideNote();
		btnHide.click(hideNote);

		// Add the button
		noteArea.append(btnHide);
	});
}

/* Parsing functions */

function createRedmineEditFieldValueAndTextObject(editFieldElementId) {
	const editFieldElement = document.querySelector(editFieldElementId);
	const redmineEditFieldValueAndTextObject = {};
	for (let i = 0; i < editFieldElement.children.length; i++) {
		redmineEditFieldValueAndTextObject[
			editFieldElement.children.item(i).value
		] = editFieldElement.children.item(i).text;
	}
	return redmineEditFieldValueAndTextObject;
}

// Parse the create page / copied task page fields
function parseTaskFieldsAndAddTemplateButtons() {
	document
		.querySelectorAll(redmineTaskFieldIdsString)
		.forEach(function (taskFieldHtmlElement) {
			try {
				const redmineTaskFieldId = taskFieldHtmlElement.id;

				// Add a save button (" + ") to the field
				const plusButtonId = 'paramSave' + taskFieldHtmlElement.id;
				const plusButtonHtml = `<input style="display: none;" type="button" class="fill paramSaveFill paramSaveFillPlus hiddenByDefault" id="${plusButtonId}" value="+">`;
				taskFieldHtmlElement.insertAdjacentHTML(
					'afterend',
					plusButtonHtml
				);
				// Add onclick action to the save button (" + ")
				document
					.getElementById(plusButtonId)
					.addEventListener('click', function () {
						const redmineTaskFieldValue =
							taskFieldHtmlElement.value;

						// If the value doesn't exist yet - add new value
						if (localStorage.getItem(redmineTaskFieldId) === null) {
							localStorage.setItem(
								redmineTaskFieldId,
								JSON.stringify([redmineTaskFieldValue])
							);
							// Append results and overwrite existing value
						} else if (
							localStorage.getItem(redmineTaskFieldId) !== null
						) {
							let currentValue =
								localStorage.getItem(redmineTaskFieldId); // possible value: "['some', 'value', 'here']"
							let parsedValue = JSON.parse(currentValue);
							parsedValue.push(redmineTaskFieldValue);
							localStorage.setItem(
								redmineTaskFieldId,
								JSON.stringify(parsedValue)
							);
						}
						// Dynamically create a template button for the saved value
						createTemplateButton(
							redmineTaskFieldId,
							redmineTaskFieldValue,
							'newlyInjectedButtonByPressingPlus'
						);
					});

				// Upon page load - create template buttons using the localStorage values
				if (localStorage.getItem(redmineTaskFieldId) !== null) {
					let currentValue = localStorage.getItem(redmineTaskFieldId); // possible value: "['some', 'value', 'here']"
					let parsedValue = JSON.parse(currentValue);

					parsedValue.forEach(function (
						redmineTaskFieldValueFromArray
					) {
						createTemplateButton(
							redmineTaskFieldId,
							redmineTaskFieldValueFromArray,
							'loadedOnPageRender'
						);
					});
				}
			} catch (error) {
				console.log(error);
			}
		});
}

/* Settings modal */

function insertSettingsModalIconAndSettingsContent() {
	let SettingsModal = $(
		`
		<a id="modalOpenIconId" class="icon icon-settings dropdownIcon"></a>
		<div id="settingsModalId" class="settingsModal">
			<div class="settingsModalContentClass">
				<span class="close">&times;</span>

					<h1>Settings</h1>
					<p>Here you can change the settings of the Tampermonkey script.</p>
					<hr>

					<div class="alertBox"><span>&#x1F6C8;</span> Note: refresh the page to see the changes.</div>



					<h3>Current page statuses</h3>

					<p>Show or hide buttons for the following statuses:</p>

					<div id="supportButtonDiv"></div>




					<h3>Other settings</h3>

					<div class="settingConfigDiv gridWrapper">
						<p>Wiki redesign</p>
						<label class="switch">
							<input type="checkbox" checked>
							<span class="slider round"></span>
						</label>
					</div>

					<div class="settingConfigDiv gridWrapper">
						<p>Task redesign</p>
						<label class="switch">
							<input type="checkbox" checked>
							<span class="slider round"></span>
						</label>
					</div>

					<div class="settingConfigDiv gridWrapper">
						<p>Copy button</p>
						<label class="switch">
							<input type="checkbox" checked>
							<span class="slider round"></span>
						</label>
					</div>

					<div class="settingConfigDiv gridWrapper">
						<p>Floating note field</p>
						<label class="switch">
							<input type="checkbox" checked>
							<span class="slider round"></span>
						</label>
					</div>


				</div>
		</div>
		`
	);
	$('#loggedas').prepend(SettingsModal);

	// Get the modal
	var modal = document.getElementById('settingsModalId');
	// Get the button that opens the modal
	var btn = document.getElementById('modalOpenIconId');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];
	// When the user clicks the button, open the modal
	btn.onclick = function () {
		modal.style.display = 'block';
	};
	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = 'none';
	};
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};

	// Add redmine fields to the config module by parsing the DOM
	const supportButtonConfigDiv = document.getElementById('supportButtonDiv');
	let issueStatusTextAndValueDOMObject =
		createRedmineEditFieldValueAndTextObject('#issue_status_id');
	for (let [key, value] of Object.entries(issueStatusTextAndValueDOMObject)) {
		// Check if item exists in localStorage. If it doesn't - add the status to the localStorage.
		if (localStorage.getItem(key) === null) {
			localStorage.setItem(key, 'Inactive'); // config set to inactive by default
		}

		// Check the status of the item in localStorage and set the checkbox accordingly
		let isActive = ''; // unchecked by default
		if (localStorage.getItem(key) === 'Active') {
			isActive = ' checked';
		}
		// Create a slider which is either checked or unchecked according to the localStorage status
		let supportButtonSetting = `
	<div class="settingConfigDiv gridWrapper">
		<p>${value}</p>
		<label class="switch">
			<input type="checkbox" id="${key}"${isActive}>
			<span class="slider round"></span>
		</label>
	</div>
	`;
		supportButtonConfigDiv.innerHTML += supportButtonSetting;

		setTimeout(function () {
			// this is needed because otherwise the event listener won't work. Exact ms needed unknown.
			// On checkbox click, change the status of the localStorage item to either "Active" or "Inactive"
			document.getElementById(key).addEventListener('click', function () {
				if (this.checked) {
					localStorage.setItem(key, 'Active');
				} else {
					localStorage.setItem(key, 'Inactive');
					document.getElementById('quickButtonId' + key).remove();
				}
			});
		}, 500);
	}
}

/* Keyboard shortcut for Edit and Submit (alt + q and alt + w) */

try {
	document.querySelector(
		'#content > div:nth-child(6) > a.icon.icon-edit'
	).accessKey = 'q'; // Edit task when shortcut Alt + q is pressed
	document.querySelector(
		'#issue-form > input[type=submit]:nth-child(7)'
	).accessKey = 'w'; // Save task when shortcut Alt + w is pressed
} catch (e) {
	console.log('First block: ' + e);

	try {
		document.querySelector(
			'#content > div:nth-child(2) > a.icon.icon-edit'
		).accessKey = 'q'; // Edit task when shortcut Alt + q is pressed (when "Successful update." is displayed)
		document.querySelector(
			'#issue-form > input[type=submit]:nth-child(7)'
		).accessKey = 'w'; // Save task when shortcut Alt + w is pressed
	} catch (e) {
		console.log('Second block: ' + e);
	}
}

/* Search bar */

function searchBarImprovements() {
	$('#q').addClass('searchLength');
}

/* Text editor */

function textEditorImprovements() {
	// Always show 'Description' area after pressing the 'Edit' button
	$('#issue_description_and_toolbar').show();

	$('textarea#issue_description').addClass('descriptionArea fontsize16');

	// Wrapping text (sometimes if there's preformatted text in the description,
	// it creates a long horizontal scrollbar which is difficult to read.

	$('div.wiki pre').addClass('descriptionArea');
}

/* Highlight terms */

// (highlights a field in the general task view page, function must select the field and values that
// should be present, in order to highlight the field.

// Idea: set up rules to highlight fields when certain conditions are met.
// Pass in a an Object = {
//   'Due date': not '',
//   'Start date': ''
// }
// ^ This should highlight the Start date field, and the dictionary should be flexible - any rule should be easy to create.

GM_addStyle(`

.fieldOfInterest {
	background-color: #ffcc85;
	border-radius: 25px;
	}

`);

// @test
// document.querySelector("#content > div.issue.tracker-1.status-2.priority-4.priority-high2.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_26.attribute > div.value").classList.add("fieldOfInterest") // working

function highlight(jsPath, highlightFieldList) {
	let field = document.querySelector(jsPath).innerText;
	if (highlightFieldList.includes(field)) {
		field.addClass('fieldOfInterest');
	}
}
// https://stackoverflow.com/questions/25487402/javascript-select-nested-class-element/25487543

/* Progress slider */

// function changeProgress(progressBarId, progressValue, animDurPerStep = 15) {
// 	var progressBar = document.getElementById(progressBarId);
// 	var oldProgressValue = -parseInt(
// 		window.getComputedStyle(progressBar).getPropertyValue("background-position")
// 	);
// 	if (progressValue > 100) progressValue = 100;
// 	else if (progressValue < 0) progressValue = 0;
// 	else progressValue = Math.round(progressValue / 10) * 10;

// 	var steps = Math.abs(oldProgressValue - progressValue) / 10;
// 	var totalAnimDur = animDurPerStep * steps;

// 	progressBar.style.transition = totalAnimDur + "ms steps(" + steps + ")";
// 	progressBar.style.backgroundPosition = -progressValue + "%";
// }

/* Main */
document.onreadystatechange = function () {
	if (document.readyState === 'interactive') {
		// Functions to run on every page
		searchBarImprovements();
		insertSettingsModalIconAndSettingsContent();
		textEditorImprovements();
		// Functions to run on a specific page
		if (
			/https:\/\/redmine\.tribepayments\.com\/issues\/.+/.test(
				currentPageUrl
			) === true // Task details page (Edit module)
		) {
			addQuickButtons('#issue_status_id');
			createAndAddHyperlinkCopyButton();
			parseTaskFieldsAndAddTemplateButtons(); // does this work here? When editing a task?
			addToggleConfigModeButton('taskDetailsPage'); // does this work here? When editing a task?
			textEditorImprovements(); // not sure if it works here
			addStickyNoteTextEditor();
			taskStatusBackgroundHighlight();
			priorityVisualization();
		} else if (
			/https:\/\/redmine\.tribepayments\.com\/projects\/.+\/issues\/(new|.+\/copy)/.test(
				currentPageUrl
			) === true // New task or Copy task page
		) {
			// addQuickButtons();
			formRefreshWatcher();
			parseTaskFieldsAndAddTemplateButtons();
			addToggleConfigModeButton('newPage');
			textEditorImprovements();
		} else if (
			/https:\/\/redmine\.tribepayments\.com\/projects\/.+\/wiki.*/.test(
				currentPageUrl
			) === true // Wiki page
		) {
			// wiki redesign
		} else {
			// Design inserts
		}
	}
};
