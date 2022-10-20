// ==UserScript==
// @name         ldRedmineUi
// @version      1.0.0
// @author       ld
// @match        redmine.tribepayments.com/*
// @grant        GM_addStyle
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/ldRedmineUi.user.js
// @updateURL    https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/ldRedmineUi.user.js
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.js
// ==/UserScript==

/* CSS */
GM_addStyle(`
  /* Task description and notes */

  div.cf_90.attribute {
    font-size: 1em;
    border-radius: 6px;
    box-shadow: rgba(6, 24, 44, 0.2) 0px 0px 0px 2px, rgba(6, 24, 44, 0.45) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset !important;
    background-color: white;
    padding: 0.5em 1em;
    margin: 0.8em 0.4em;
  }

  /* Page Global CSS */
  .tab-content {
    border: none;
  }

  #footer, #footer > a {
    border-top: none;
    color: white;
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

  #modalOpenIconId:hover {
    cursor: pointer;
  }

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

  .paramFavoriteFill {
    background-color: #ffeaa4;
    line-height: 4px;
    font-size: 1rem;
    padding: 0.25rem;
  }
  .paramFavoriteFill:hover {
    cursor: pointer;
    background-color: #ffe282;
  }
  .paramFavoriteFill:active {
    background-color: #ffd23c;
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
      padding-left: 2em;
      padding-right: 1.2em;
      padding-top: 0.4em;
      padding-bottom: 0.5em;
      display: inline;
      outline: #462068 solid 1px;
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

  .paramTemplateBtnFill:active {
    background-color: #accda6;
  }

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



  h2 {
    font-size: 1.6em;
  }

  .fontsize16 {
    font-size: 1em;
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


  /* Search bar */

  /*.searchLength {
    width: 50vw !important;
  }
  */



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

const wikiRedesign = () => {
  GM_addStyle(`
    #header {
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(136,0,255,1) 100%);
    }

    .wiki.wiki-page {
        /* https://support.smartbear.com/swaggerhub/docs/organizations/custom-rules.html */
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10.5px;
        margin-block-end: 10.5px;
        margin-block-start: 10.5px;
        margin-bottom: 10.5px;
        line-height: 20px;
        width: 50%;
        max-width: 800px;
        font-family: 'Segoe UI','Open Sans',Arial,Verdana;
        font-size: 15px;
        text-align: left;
    }

    .wiki.wiki-page h1,h2,h3,h4 {
        font-family: "Open Sans",sans-serif;
        letter-spacing: 0.24px;
        line-height: 33.6px;
        margin-block-end: 0px;
        margin-block-start: 48px;
    }

    .wiki.wiki-page h1 {
        font-size: 28px;
        margin-top: 48px;
    }

    .wiki.wiki-page h2 {
        font-size: 22px;
        margin-top: 36px
    }

    .wiki.wiki-page h3 {
        font-size: 18px;
        margin-top: 24px;
    }

    .wiki.wiki-page a {
        line-height: 1.5;
    }

    .wiki.wiki-page p {
        margin: 1.4ex 0 1.4ex 0;
    }

    .wiki.wiki-page a:hover {
        text-decoration: none;
        color: darkblue;
        -webkit-text-stroke: 0.5px darkblue;
    }


    /* TOC */
    div.wiki ul.toc {
        background-color: #EDEDFF;
        border-radius: 10px;
        overflow-wrap: break-word;
    }

    div.wiki ul.toc a {
        font-size: 14px;
    }

    /* Breadcrumb */
    #content > p.breadcrumb {
        font-size: 20px;
    }

    #content > p.breadcrumb > a {
        font-family: "Inter", sans-serif;
        font-size: 16px;
        color: purple;
    }

    #content > p.breadcrumb > a:hover {
        text-decoration: none;
        color: purple;
        -webkit-text-stroke: 0.5px purple;
    }

    textarea#content_text {
      font-size: 15px !important;
      font-family: "Inter", sans-serif!important;
    }

    `);
};

//-------------------------- WIKI INNER PAGE --------------------------------

GM_addStyle(`

`);

/* Imports */

var $ = window.jQuery;

/* Constants */

const devProjectsArray = [
  "  » Bank",
  "  » Gateway",
  "  » ISAC-POS",
  "  » -=MISC=-",
  "  » Bill",
  "  » ISAC-ACQ",
  "  » ISAC-ISS",
  "  » OpenBank",
  "  » Risk",
  "  » Wallet",
];
// Remaining non-dev projects:
// 'Incidents'
// 'Knowledge Centre'
// 'Products'
// 'RFC'
// 'Support'

const redmineTaskFieldIdsString = `
	#all_attributes input[type="text"],
	#all_attributes input[type="date"],
	#all_attributes select,
	#all_attributes textarea
	`;
// #all_attributes input[type="checkbox"],

const currentPageUrl = window.location.href;

function getProjectStatusColorPatterns() {
  const taskSelectedProjectText = getTaskSelectedOptionText("#issue_project_id");
  const taskSelectedTrackerText = getTaskSelectedOptionText("#issue_tracker_id");

  // default color pattern if project match is not found
  // Button color regex (from Tampermonkey convenience script)
  let statusColorPatterns = {
    "^Pending Approval$": "#fcf3cf",
    "^Not Approved$": "#eafaf1",
    "^New$": "#82e0aa",
    "^In Progress.*": "#f7db6f",
    "^Resolved$": "#85c1e9",
    "^Feedback$": "#ec7063",
    "^Closed$": "#d5d8dc",
    "^Rejected$": "#abb2b9",
    "^Suspended$": "#fdedec",
    "^Pending.*": "#f7f2dc",
  };

  // Incidents
  const incidentStatusColorPatterns = {
    "^Scheduled$": "#fcf3cf",
    "^In Progress.*": "#f7db6f",
    "^Resolved$": "#85c1e9",
    "^Feedback$": "#ec7063",
    "^Closed$": "#d5d8dc",
    "^Rejected$": "#abb2b9",
  };

  /* RFC project */
  // Tracker order is according to deployment procedure
  // Status last changed by TL - '#f7db6f'
  // Status last changed by QA - '#85c1e9'
  // Status last changed by Deployer - '#fcf3cf'

  // Release tracker
  const ReleaseStatusColorPatterns = {
    "^New$": "#82e0aa",
    "^Related.*": "#fcf3cf",
    "^Merged.*": "#fcf3cf",
    "^Tested.*": "#85c1e9",
    "^Closed$": "#d5d8dc",
  };

  // RFC tracker
  const RfcStatusColorPatterns = {
    "^New$": "#82e0aa",
    "^Merged.*": "#fcf3cf",
    "^Tested.*": "#85c1e9",
    "^Ready.*": "#f7db6f",
    "^Authorized.*": "#f7db6f",
    "^In Progress.*": "#fcf3cf",
    "^Applied.*": "#fcf3cf",
    "^Verified (OK).*": "#85c1e9",
    "^Closed$": "#d5d8dc",
    "^Roll-backed.*": "#ec7063",
  };

  if (taskSelectedProjectText === "RFC") {
    if (taskSelectedTrackerText === "Release") {
      statusColorPatterns = ReleaseStatusColorPatterns;
    } else if (taskSelectedTrackerText === "RFC") {
      statusColorPatterns = RfcStatusColorPatterns;
    }
  } else if (taskSelectedProjectText === "Incidents") {
    statusColorPatterns = incidentStatusColorPatterns;
  }

  return statusColorPatterns;
}

/* Helper functions */

function formRefreshWatcher() {
  setTimeout(function () {
    try {
      // targetNode is created with a slight delay on page load and might not be found
      // Select the node that will be observed for mutations
      const targetNode = document.querySelector(".ui-autocomplete");
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
    } catch (e) {
      // console.log('Mutation observer error')
    }
  }, 100);
}

function getTaskSelectedOptionText(taskFieldId) {
  const projectIdElement = document.querySelector(taskFieldId);
  if (!projectIdElement) {
    return 
  }
  const selectedOptions = projectIdElement.options;
  const selectedOptionIndex = projectIdElement.selectedIndex;
  const selectedProjectOptionText = selectedOptions[selectedOptionIndex].text;
  return selectedProjectOptionText;
}

function showcaseTaskPhase() {
  const project = getTaskSelectedOptionText("#issue_project_id");
  if (devProjectsArray.includes(project)) {
    const taskStatus = getTaskSelectedOptionText("#issue_status_id");
    const mrStatus = getTaskSelectedOptionText("#issue_custom_field_values_26");
    const testStatus = getTaskSelectedOptionText("#issue_custom_field_values_4");
    const deployedLiveDate = document.querySelector("#issue_custom_field_values_9").value;
    let taskPhase = "";
    let warningMessage = "";

    if (taskStatus === "In Progress" || taskStatus === "Feedback") {
      taskPhase = "Development";
    } else if (taskStatus === "Resolved") {
      if (mrStatus === "REVIEW") {
        taskPhase = "Code review";
      } else if (mrStatus === "DONE") {
        if (testStatus === "tested") {
          taskPhase = "Pending deployment";
        } else {
          taskPhase = "Testing";
        }
      }
    } else if (taskStatus === "Closed" && mrStatus === "MERGED" && deployedLiveDate !== "") {
      taskPhase = "Deployed";
    } else if (taskStatus === "Resolved" && mrStatus === "MERGED" && deployedLiveDate !== "") {
      taskPhase = "Deployed";
      warningMessage = " (Warning: deployed task not closed)";
    }
    if (taskPhase !== "") {
      const taskHeaderText = document.querySelector("#content > h2").innerText;
      document.querySelector(
        "#content > h2"
      ).innerHTML = `${taskHeaderText} <span style="font-family: monospace; padding: 0.15em 0.5em 0.15em 0.4em; margin-left: 0.2em; border-radius: 6px; outline: #628DB6 solid 2px;"> &#8594 ${taskPhase}<span style="color: #d04829;">${warningMessage}</span></span>`;
    }
  }
}

/* Button functions */

function prettifyEditButton() {
  document.querySelector(".icon-edit").classList.add("fill");
}

function addStatusButton(htmlColorCodeWithHashtag, buttonText, statusId) {
  // Identify div to add the button to
  let topHorizontalToolbar = document.querySelector("#content > h2");
  const quickButtonId = `quickButtonId${statusId}`;
  let btn = `<a class="fill" id="${quickButtonId}" style="background-color:${htmlColorCodeWithHashtag}!important">${buttonText}</a>`;
  topHorizontalToolbar.insertAdjacentHTML("afterend", btn);
  document.querySelector(`#${quickButtonId}`).addEventListener("click", function () {
    document.querySelector("#issue_status_id").value = statusId;
    document.querySelector("#issue-form").submit();
  });
}

function addQuickButtons(issueFieldId) {
  try {
    let issueStatusTextAndValueDOMObject = createRedmineEditFieldValueAndTextObject(issueFieldId);
    const issueFieldValue = document.querySelector(issueFieldId).value;
    const statusColorPatterns = getProjectStatusColorPatterns();
    for (let [key, value] of Object.entries(issueStatusTextAndValueDOMObject)) {
      // Map colors to status values
      let currentButtonColor = ""; // Default button color if no color is found
      for (let [string, color] of Object.entries(statusColorPatterns)) {
        if (value.match(new RegExp(string, "i"))) {
          currentButtonColor = color;
          break;
        }
      }
      if (localStorage.getItem(key) === "Active" && issueFieldValue !== key) {
        addStatusButton(currentButtonColor, value, key);
      }
    }
  } catch (e) {
    //
  }
}

function createAndAddHyperlinkCopyButton() {
  GM_addStyle(`
    #content > h2:hover, #content > h2:hover:after {
      color: #377FB4;
    }
    #content > h2:active, #content > h2:active:after {
      color: #82e0aa;
    }
  `);

  // Identify div to add the button to
  let taskName = document.querySelector("#content > h2");

  // Preparing content to write to clipboard
  let taskTitle = document.querySelector("head > title").text.slice(0, -17); // Turn header element into text, then remove " - TribePayments" part of the string
  // Remove the " - <Project name>" from the end of the string
  let cleanedStringEndingIndex = taskTitle.lastIndexOf(" - ");
  let cleanedTaskTitle = taskTitle.substring(0, cleanedStringEndingIndex);
  // Create a hyperlink
  $("#footer").append(`<a href="${currentPageUrl}" style="color: white">${cleanedTaskTitle}</a>`);
  // This is a working solution that copies a hyperlink | Source: https://stackoverflow.com/questions/53003980/how-to-copy-a-hypertext-link-into-clipboard-with-javascript-and-preserve-its-lin
  const onClick = (evt) => {
    const link = document.querySelector("#footer > a:nth-child(2)"); // select hyperlink to copy from DOM
    const range = document.createRange();
    range.selectNode(link);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy"); // deprecated but still works
    // navigator.clipboard.writeText(); --> for future use (and should be added to button onclick function)
  };
  taskName.addEventListener("click", function () {
    // navigator.clipboard.writeText(link)
    onClick();
  });
}

function createTemplateButton(
  redmineTaskFieldId,
  redmineTaskFieldLabel,
  redmineTaskFieldValue,
  isFavorite,
  project,
  uniqueId,
  createdBy
) {
  if (project !== document.querySelector("body").classList[0].replace("project-", "")) {
    // console.log(`createTemplateButton warning: attemped button to create does not belong to this project.`)
    return;
  }
  const taskFieldHtmlElement = document.getElementById(redmineTaskFieldId);
  const taskTemplateButtonId = "paramSaveTemplateButton" + redmineTaskFieldId + new Date().getTime().toString();
  // Preparing button values - truncating if the value is too long
  const redmineTaskFieldLabelMaxLength = 55;
  let redmineTaskFieldLabelTruncated = redmineTaskFieldLabel;
  if (redmineTaskFieldLabel.length > redmineTaskFieldLabelMaxLength) {
    redmineTaskFieldLabelTruncated = redmineTaskFieldLabel.substring(0, 55) + "...";
  }
  // Insert a template button (without click action)
  if (createdBy === "newlyInjectedButtonByPressingPlus") {
    display = "inline-block";
  } else if (createdBy === "loadedOnPageRender") {
    display = "none";
  }
  const deleteParamTemplateBtnId = "deleteParamTemplateBtn" + redmineTaskFieldId + new Date().getTime().toString();

  const allFavoriteBtns = "favoriteBtn" + redmineTaskFieldId;
  const favoriteBtnId = "favoriteBtn" + redmineTaskFieldId + new Date().getTime().toString();
  const favoriteBtnText = isFavorite ? "★" : "☆";

  let templateButtonHtml = `
    <button type="button" class="fill paramSaveFill paramTemplateBtnFill" id="${taskTemplateButtonId}" title="${redmineTaskFieldLabel}" value="${redmineTaskFieldValue}">${redmineTaskFieldLabelTruncated}</button>
    <button style="display: ${display};" type="button" class="paramFavoriteFill hiddenByDefault ${allFavoriteBtns}" title="Pre-fill this value as default on page load." id="${favoriteBtnId}">${favoriteBtnText}</button>
    <button style="display: ${display};" type="button" class="deleteParamTemplateBtnFill hiddenByDefault" id="${deleteParamTemplateBtnId}">✖</button>
  `;
  taskFieldHtmlElement.insertAdjacentHTML("afterend", templateButtonHtml);

  // Add click action for the button
  const thisTemplateButtonElement = document.getElementById(taskTemplateButtonId);
  thisTemplateButtonElement.addEventListener("click", function () {
    document.getElementById(redmineTaskFieldId).value = redmineTaskFieldValue;
  });
  const thisFavoriteBtnElem = document.getElementById(favoriteBtnId);

  // Add click action for the favorite button
  thisFavoriteBtnElem.addEventListener("click", function () {
    // Toggle favorite icon
    const buttonValueBeforeClearing = this.textContent;
    document.querySelectorAll("." + allFavoriteBtns).forEach((favoriteButton) => {
      favoriteButton.textContent = "☆";
    });
    this.textContent = buttonValueBeforeClearing === "☆" ? "★" : "☆";
    // Prep data
    let currentArray = localStorage.getItem(redmineTaskFieldId);
    let parsedArrayValue = JSON.parse(currentArray);
    // Find the array object
    for (let i = 0; i < parsedArrayValue.length; i++) {
      if (parsedArrayValue[i].redmineTaskFieldValue === redmineTaskFieldValue) {
        parsedArrayValue[i].isFavorite = parsedArrayValue[i].isFavorite ? false : true;
        continue;
      }
      // Only one favorite can be active at a time
      // Wipe all the other favorites
      parsedArrayValue[i].isFavorite = false;
    }
    localStorage.setItem(redmineTaskFieldId, JSON.stringify(parsedArrayValue));
  });

  // Add click action for the X delete button
  document.getElementById(deleteParamTemplateBtnId).addEventListener("click", function () {
    let currentValue = localStorage.getItem(redmineTaskFieldId);
    let parsedValue = JSON.parse(currentValue);

    let index;
    for (let i = 0; i < parsedValue.length; i++) {
      if (parsedValue[i].uniqueId === uniqueId) {
        index = i;
        break;
      }
    }
    parsedValue.splice(index, 1);

    localStorage.setItem(redmineTaskFieldId, JSON.stringify(parsedValue));
    this.remove(); // removes the X button
    thisTemplateButtonElement.remove(); // removes the template button
    thisFavoriteBtnElem.remove();
  });
}

function addToggleConfigModeButton(pageName) {
  let contentDivElement;
  if (pageName === "taskDetailsPage") {
    contentDivElement = document.querySelector("#update > h3");
  } else if (pageName === "newPage") {
    contentDivElement = document.querySelector("#content > h2");
  }
  const newIssueConfigToggleBtn = `<button type="button" class="fill paramSaveFill" id="newIssueConfigToggleBtnId">Toggle config mode</button>`;
  contentDivElement.insertAdjacentHTML("afterend", newIssueConfigToggleBtn);
  const thisNewIssueConfigToggleBtnId = document.getElementById("newIssueConfigToggleBtnId");
  thisNewIssueConfigToggleBtnId.addEventListener("click", function () {
    document.querySelectorAll(".hiddenByDefault").forEach(function (item) {
      try {
        item.style.display = item.style.display === "none" ? "inline-block" : "none";
      } catch (error) {
        console.log(error);
      }
    });
  });
}

/* Task content (description, notes) */

/* Removing UI elements */

// function removeUiElements() {
//   let removeClassesList = [
//     "other-formats",
//     ".icon-comment",
//     ".next-prev-links",
//     "#content > p",
//     "#add_to_important_list",
//     "icon-fav-off",
//     // '#sidebar',
//   ];
//   removeClassesList.forEach((className) => document.querySelectorAll(className).forEach((e) => e.remove()));

//   document.querySelectorAll("#add_to_important_list").forEach((e) => e.remove());
// }

/* Task status background highlight */

function taskStatusBackgroundHighlight() {
  try {
    // Map colors to status values
    let highlightColor = ""; // Default button color if no color is found
    const statusElement = document.querySelector("div.status.attribute > div.value");
    const statusValue = statusElement.textContent;
    const statusColorPatterns = getProjectStatusColorPatterns();
    for (let [string, color] of Object.entries(statusColorPatterns)) {
      if (statusValue.match(new RegExp(string, "i"))) {
        highlightColor = color;
        break;
      }
    }
    // Replace status text with styled content
    statusElement.innerHTML = `<span style="background-color: ${highlightColor}; padding-left: 1em; padding-right: 1em; border-radius: 3px;">${statusValue}</span>`;
  } catch (e) {
    //
  }
}

/* Priority visualization */

const priorityNameAndColorObject = {
  "Very low": "#E5E4E2",
  Low: "#ACCFF3",
  Normal: "#72CB57",
  High: "#F6BC00",
  Urgent: "#FF5733",
  Immediate: "#900C3F",
};

function priorityVisualization() {
  let highlightColor = ""; // Default button color if no color is found
  const priorityElement = document.querySelector("div.priority.attribute > div.value");
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

// function addStickyNoteTextEditor() {
//   GM_addStyle(`

// 	/* This is the outer part of the Note text box*/
// 	.stickyNotes {
// 		position: fixed !important;
// 		bottom: 0 !important;
// 		right: 20px !important;
// 		min-width: 800px !important;
// 		max-width: 1600px !important;
// 		width: 40vw !important;
//     max-height: 80vh !important;
// 		background: #283747 !important;
// 		border-radius: 10px !important;
// 		box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset !important;
// 	}

// 	textarea#issue_notes {
// 		font-size: 1.3em;
// 		font-family: Inter, "Helvetica Neue", Helvetica, sans-serif !important;
// 	}

// 	/* Set 'Private notes' text to be white (because it's on black background). */
// 	fieldset.stickyNotes {
// 		color: #fff !important;
// 	}

// 	`);

//   GM_addStyle(`

// 	.showButton {
// 		position: fixed;
// 		bottom: 0;
// 		background-color: #283747;
// 		color: white;
// 		border-radius: 10px;
// 		min-width: 100px;
// 		min-height: 30px;
// 		font-family: Inter, "Helvetica Neue", Helvetica, sans-serif;
// 	}

// 	.showButton:hover {
// 		background-color: #283747;
// 		box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
// 	}

// 	`);

//   // --- Add Note text area --------------------------------------------------------

//   document.querySelector("#issue-form > div > fieldset:nth-child(3)").classList.add("stickyNotes");
//   document.querySelector(".stickyNotes legend").remove();

//   let textArea = document.querySelector("#issue_notes"); // select the text note inner field

//   // Constantly recalculating the height & Saving the textarea value to local storage
//   textArea.addEventListener("keyup", () => {
//     this.style.height = "";
//     this.style.height = this.scrollHeight + "px";
//   });

//   // --- Add a submit button to the Note area ---------------------------------------

//   let noteArea = document.querySelector(".stickyNotes");

//   // a button is equal to
//   let submitBtnHtml =
//     '<input type="submit" id="noteSubmitButton" name="commit" value="Submit" data-disable-with="Submit">';
//   // Add the button
//   noteArea.insertAdjacentHTML("beforeend", submitBtnHtml);
//   // a button's on-click action is
//   document.querySelector("#noteSubmitButton").addEventListener("click", () => {
//     clearNoteFromLocalStorage();
//     document.querySelector("#issue-form").submit();
//   });

//   // --- Note hide button ------------------------------------------
//   GM_addStyle(`

// 	.hideButton {
// 		margin-left: 5px !important;
// 	}

// 	`);

//   // a button is equal to
//   let viewNoteBtn = '<input type="button" id="toggleNoteViewBtn" class="hideButton" value="Hide">';
//   let minimizedBtn = $('<input type="button" class="showButton Resolved" value="Show note">');
//   // Add the button
//   noteArea.insertAdjacentHTML("beforeend", viewNoteBtn);
//   document.querySelector("div#footer").insertAdjacentHTML("beforeend", minimizedBtn);

//   document.querySelector("#toggleNoteViewBtn").addEventListener("click", () => {

//     // a button's on-click action is
//     minimizedBtn.click(function () {
//       document.querySelector("#issue-form > div > fieldset.stickyNotes").show(); // todo
//       // document.querySelector("#update") -> this should be set to inline-block
//       $("#footer > input").hide();
//     });
//   });
// }

/* Parsing functions */

function createRedmineEditFieldValueAndTextObject(editFieldElementId) {
  const editFieldElement = document.querySelector(editFieldElementId);
  const redmineEditFieldValueAndTextObject = {};
  for (let i = 0; i < editFieldElement.children.length; i++) {
    redmineEditFieldValueAndTextObject[editFieldElement.children.item(i).value] =
      editFieldElement.children.item(i).text;
  }
  return redmineEditFieldValueAndTextObject;
}

// Parse create/copy task page fields and create template buttons / prefill favorites
function parseTaskFieldsAndAddTemplateButtons() {
  document.querySelectorAll(redmineTaskFieldIdsString).forEach(function (taskFieldHtmlElement) {
    try {
      const redmineTaskFieldId = taskFieldHtmlElement.id;

      // Add a save button (" + ") to the field
      const plusButtonId = "paramSave" + taskFieldHtmlElement.id;
      const plusButtonHtml = `<input style="display: none;" type="button" class="fill paramSaveFill paramSaveFillPlus hiddenByDefault" id="${plusButtonId}" value="+">`;
      taskFieldHtmlElement.insertAdjacentHTML("afterend", plusButtonHtml);

      // Add onclick action to the save button (" + ")
      document.getElementById(plusButtonId).addEventListener("click", function () {
        const redmineTaskFieldValue = taskFieldHtmlElement.value;
        let redmineTaskFieldLabel = redmineTaskFieldValue;
        const uniqueId = new Date().getTime();
        try {
          redmineTaskFieldLabel =
            taskFieldHtmlElement.textContent !== ""
              ? taskFieldHtmlElement.selectedOptions[0].textContent
              : redmineTaskFieldValue;
        } catch (e) {
          //
        }
        // If entry doesn't exist yet - create a new entry
        if (localStorage.getItem(redmineTaskFieldId) === null) {
          localStorage.setItem(
            redmineTaskFieldId,
            JSON.stringify([
              {
                redmineTaskFieldLabel: redmineTaskFieldLabel,
                redmineTaskFieldValue: redmineTaskFieldValue,
                isFavorite: false,
                project: document.querySelector("body").classList[0].replace("project-", ""),
                uniqueId: uniqueId,
              },
            ])
          );
          // If entry exists - append entry to an array and overwrite existing value
        } else if (localStorage.getItem(redmineTaskFieldId) !== null) {
          let currentValue = localStorage.getItem(redmineTaskFieldId);
          let parsedValue = JSON.parse(currentValue);
          parsedValue.push({
            redmineTaskFieldLabel: redmineTaskFieldLabel,
            redmineTaskFieldValue: redmineTaskFieldValue,
            isFavorite: false,
            project: document.querySelector("body").classList[0].replace("project-", ""),
            uniqueId: uniqueId,
          });
          localStorage.setItem(redmineTaskFieldId, JSON.stringify(parsedValue));
        }
        // Dynamically create a template button for the saved value
        createTemplateButton(
          redmineTaskFieldId,
          redmineTaskFieldLabel,
          redmineTaskFieldValue,
          false,
          document.querySelector("body").classList[0].replace("project-", ""),
          uniqueId,
          "newlyInjectedButtonByPressingPlus"
        );
      });

      // Upon page load - create template buttons using the localStorage values
      if (localStorage.getItem(redmineTaskFieldId) !== null) {
        let currentValue = localStorage.getItem(redmineTaskFieldId);
        let parsedValue = JSON.parse(currentValue);

        parsedValue.forEach(function (labelAndValueObject) {
          createTemplateButton(
            redmineTaskFieldId,
            labelAndValueObject.redmineTaskFieldLabel,
            labelAndValueObject.redmineTaskFieldValue,
            labelAndValueObject.isFavorite,
            labelAndValueObject.project,
            labelAndValueObject.uniqueId,
            "loadedOnPageRender"
          );
        });
      }
    } catch (error) {
      console.log("Error in parseTaskFieldsAndAddTemplateButtons: " + error);
    }
  });
}

function prefillIsFavoriteFields() {
  setTimeout(() => {
    document.querySelectorAll(redmineTaskFieldIdsString).forEach(function (taskFieldHtmlElement) {
      try {
        const redmineTaskFieldId = taskFieldHtmlElement.id;

        // While parsing, find fields with isFavorite: true
        // If isFavorite: true - preset the field value.

        // Find the array object
        let currentArray = localStorage.getItem(redmineTaskFieldId);
        let parsedArrayValue = JSON.parse(currentArray);

        if (parsedArrayValue) {
          for (let i = 0; i < parsedArrayValue.length; i++) {
            if (
              parsedArrayValue[i].isFavorite &&
              parsedArrayValue[i].project === document.querySelector("body").classList[0].replace("project-", "")
            ) {
              document.getElementById(redmineTaskFieldId).value = parsedArrayValue[i].redmineTaskFieldValue;
              break;
            }
          }
        }
      } catch (error) {
        console.log("Error in prefillIsFavoriteFields: " + error);
      }
    });
  }),
    200;
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

					<div class="alertBox"><span>&#x1F6C8;</span> Note: refresh the page to see the changes.</div>

          <hr>

					<h3>Feature settings</h3>
          
          <div id="settingsList">

          <div class="settingConfigDiv gridWrapper">
          <p>Enable wiki redesign</p>
          <label class="switch">
            <input type="checkbox" id="wikiRedesign">
            <span class="slider round"></span>
          </label>
        </div>

          <div class="settingConfigDiv gridWrapper">
            <p>Add background highlight for the priority field within a task</p>
            <label class="switch">
              <input type="checkbox" id="visualizePriority">
              <span class="slider round"></span>
            </label>
          </div>  

          <div class="settingConfigDiv gridWrapper">
            <p>Add an indicator icon for the status field within a task</p>
            <label class="switch">
              <input type="checkbox" id="visualizeStatus">
              <span class="slider round"></span>
            </label>
         </div>

        <div class="settingConfigDiv gridWrapper">
          <p>Display the task's development phase next to task title</p>
          <label class="switch">
            <input type="checkbox" id="displayTaskPhase">
            <span class="slider round"></span>
          </label>
         </div>

         <div class="settingConfigDiv gridWrapper">
           <p>Enable task hyperlink copying when clicking on the task title within a task</p>
           <label class="switch">
             <input type="checkbox" id="copyTaskHyperlink">
             <span class="slider round"></span>
           </label>
         </div>

					<div class="settingConfigDiv gridWrapper">
						<p>Enable "% Done" interactive picker</p>
						<label class="switch">
							<input type="checkbox" id="percentDoneInteractiveSlider">
							<span class="slider round"></span>
						</label>
					</div>

          <!-- 
            <div class="settingConfigDiv gridWrapper">
              <p>Enable floating note field</p>
              <label class="switch">
                <input type="checkbox" id="floatingNoteField">
                <span class="slider round"></span>
              </label>
            </div>
          -->

          <div class="settingConfigDiv gridWrapper">
            <p>Highlight the edit button</p>
            <label class="switch">
              <input type="checkbox" id="highlightEditButton">
              <span class="slider round"></span>
            </label>
          </div>

         

         </div>

         <hr>

          <h3>Current page statuses</h3>

					<p>Show or hide buttons for the following statuses:</p>

					<div id="supportButtonDiv"></div>


				</div>
		</div>
		`
  );
  $("#loggedas").prepend(SettingsModal);

  // Settings modal control

  // Get the modal
  var modal = document.getElementById("settingsModalId");
  // Get the button that opens the modal
  var btn = document.getElementById("modalOpenIconId");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  try {
    // Adding "quick status" buttons by parsing the DOM
    const supportButtonConfigDiv = document.getElementById("supportButtonDiv");
    let issueStatusTextAndValueDOMObject = createRedmineEditFieldValueAndTextObject("#issue_status_id");
    for (let [key, value] of Object.entries(issueStatusTextAndValueDOMObject)) {
      // Check if item exists in localStorage. If it doesn't - add the status to the localStorage.
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, "Inactive"); // config set to inactive by default
      }

      // Check the status of the item in localStorage and set the checkbox accordingly
      let isActive = ""; // unchecked by default
      if (localStorage.getItem(key) === "Active") {
        isActive = " checked";
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
        document.getElementById(key).addEventListener("click", function () {
          if (this.checked) {
            localStorage.setItem(key, "Active");
          } else {
            localStorage.setItem(key, "Inactive");
            try {
              document.getElementById("quickButtonId" + key).remove();
            } catch (e) {
              /* if the switch is toggled multiple times and the page is not refreshed - it will throw an error */
            }
          }
        });
      }, 500);
    }
  } catch (e) {
    /* This whole block should be moved to a separate function and not run on wiki pages */
  }
}

const attemptToInitializeSettingsInLocalStorage = () => {
  if (localStorage.getItem("ldRedmineUiSettings")) {
    return;
  }
  const initialSettings = {
    percentDoneInteractiveSlider: false,
    copyTaskHyperlink: false,
    floatingNoteField: false,
    wikiRedesign: false,
    highlightEditButton: false,
    visualizePriority: false,
    visualizeStatus: false,
    displayTaskPhase: false,
  };
  localStorage.setItem("ldRedmineUiSettings", JSON.stringify(initialSettings));
};

const setSettingSliderAccordingToLocalStorageValue = () => {
  const stringStorage = localStorage.getItem("ldRedmineUiSettings");
  const storageObject = JSON.parse(stringStorage);

  // Display saved value
  document.querySelectorAll('#settingsList input[type="checkbox"]').forEach((element) => {
    let settingSliderValue = storageObject[element.id];
    if (settingSliderValue) {
      element.checked = true;
    } else {
      element.checked = false;
    }

    // Add on-click action for the slider
    element.addEventListener("click", () => {
      // Get values
      const stringStorage = localStorage.getItem("ldRedmineUiSettings");
      const storageObject = JSON.parse(stringStorage);
      // Write data to local storage
      storageObject[element.id] = element.checked;
      localStorage.setItem("ldRedmineUiSettings", JSON.stringify(storageObject));
    });
  });
};

/* Keyboard shortcut for Edit and Submit (alt + q and alt + w) */

function addKeyboardShortcutForEditAndSubmit() {
  try {
    document.querySelector("#content > div:nth-child(6) > a.icon.icon-edit").accessKey = "q"; // Edit task when shortcut Alt + q is pressed
    document.querySelector("#issue-form > input[type=submit]:nth-child(7)").accessKey = "w"; // Save task when shortcut Alt + w is pressed
  } catch (e) {
    // console.log("First block: " + e);

    try {
      document.querySelector("#content > div:nth-child(2) > a.icon.icon-edit").accessKey = "q"; // Edit task when shortcut Alt + q is pressed (when "Successful update." is displayed)
      document.querySelector("#issue-form > input[type=submit]:nth-child(7)").accessKey = "w"; // Save task when shortcut Alt + w is pressed
    } catch (e) {
      // console.log("Second block: " + e);
    }
  }
}

/* Search bar */

// function searchBarImprovements() {
//   document.querySelector("#q").classList.add("searchLength");
// }

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

function highlight(jsPath, highlightFieldList) {
  let field = document.querySelector(jsPath).innerText;
  if (highlightFieldList.includes(field)) {
    field.addClass("fieldOfInterest");
  }
}
// https://stackoverflow.com/questions/25487402/javascript-select-nested-class-element/25487543

/* Progress slider */

const donePercentSlider = () => {
  GM_addStyle(`

    table.progress td.done {
      background-color: #33b533!important;
    }
    
    div.value > table.progress td {
      border-radius: 1px;
      outline: white solid 1px;
    }

    /* on-hover, change the background color of a table element and all of the subsequent elements. */
    div.value > table.progress td:hover ~ td, div.value > table.progress td:hover {
      background: #33b533!important;
      transition: all 0.3s ease-in;
      cursor: pointer;
    }

    /* Reverse table item order so that we can use ~ td and highlight only the preceding elements */
    div.value > table.progress {
      direction: rtl;
    }

  `);

  // Find percentage
  const donePercentageStr = document
    .querySelector(".progress.attribute > .value > p.percent")
    .textContent.replace("%", "");
  const donePercentageInt = parseInt(donePercentageStr);

  // Prepare ul elements
  let arrayOfNewChildren = [];
  for (let i = 100; i > 0; i -= 10) {
    arrayOfNewChildren.push(
      `<td style="width: 10%;" title="${i}" id="${i}" class="timelineBlock ${
        i <= donePercentageInt ? "done" : "todo"
      }"></td>`
    );
  }

  // Insert ul elements
  // for each 10% add an element with "done" and add the remaining as "todo"
  const progressBlock = document.querySelector("div.progress.attribute > div.value > table > tbody > tr");
  progressBlock.innerHTML = arrayOfNewChildren.join("");

  // Helper function
  function selectOptionFromElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
  }

  // For each child, add an onclick action to submit form with done%
  document.querySelectorAll(".timelineBlock").forEach((timelineBlock) => {
    timelineBlock.addEventListener("click", () => {
      // Set the done percentage (from a list of options)
      selectOptionFromElement("issue_done_ratio", timelineBlock.id);
      // Submit the form
      document.querySelector("#issue-form").submit();
    });
  });
};

const runIfSettingIsActive = (settingName, callback, argumentString = null) => {
  try {
    const stringStorage = localStorage.getItem("ldRedmineUiSettings");
    const storageObject = JSON.parse(stringStorage);
    if (storageObject[settingName] === true) {
      if (argumentString) {
        callback(argumentString);
      } else {
        callback();
      }
    }
  } catch (e) {
    console.log(`Error in runIfSettingIsActive - setting name: "${settingName}" was not applied due to exception.`);
  }
};

/* Main */
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    // Functions to run on every page
    // runIfSettingIsActive('', searchBarImprovements)
    insertSettingsModalIconAndSettingsContent();
    attemptToInitializeSettingsInLocalStorage();
    setSettingSliderAccordingToLocalStorageValue();
    // Functions to run on a specific page
    if (/https:\/\/redmine\.tribepayments\.com\/issues\/.+/.test(currentPageUrl) === true) {
      // Task details page (Edit module)
      runIfSettingIsActive("percentDoneInteractiveSlider", donePercentSlider);
      runIfSettingIsActive("highlightEditButton", prettifyEditButton);
      runIfSettingIsActive("displayTaskPhase", showcaseTaskPhase);
      runIfSettingIsActive("copyTaskHyperlink", createAndAddHyperlinkCopyButton);
      // runIfSettingIsActive("floatingNoteField", addStickyNoteTextEditor);
      runIfSettingIsActive("visualizeStatus", taskStatusBackgroundHighlight);
      runIfSettingIsActive("visualizePriority", priorityVisualization);
      addToggleConfigModeButton("taskDetailsPage");
      addQuickButtons("#issue_status_id");
      parseTaskFieldsAndAddTemplateButtons();
      addKeyboardShortcutForEditAndSubmit();
      // removeUiElements();
    } else if (
      /https:\/\/redmine\.tribepayments\.com\/projects\/.+\/issues\/(new|.+\/copy)/.test(currentPageUrl) === true
    ) {
      // New task or Copy task page
      // addQuickButtons();
      formRefreshWatcher();
      parseTaskFieldsAndAddTemplateButtons();
      addToggleConfigModeButton("newPage");
      prefillIsFavoriteFields();
      addKeyboardShortcutForEditAndSubmit();
    } else if (/https:\/\/redmine\.tribepayments\.com\/projects\/.+\/wiki.*/.test(currentPageUrl) === true) {
      // Wiki page
      runIfSettingIsActive("wikiRedesign", wikiRedesign);
      addKeyboardShortcutForEditAndSubmit();
    }
  }
};
