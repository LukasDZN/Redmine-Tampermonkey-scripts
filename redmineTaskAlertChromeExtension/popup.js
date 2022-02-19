"use strict";
// --- Notes ------------------------------------------------------------------------
// chrome://extensions/ --> turn on developer mode and choose "load unpacked"
// then locate the folder of your extension
// chrome://extensions
// 128 x 128 --> should be called icon_128.png
// 19 x 19 --> toolbar icon, that should be called icon.png
// Image resizer: http://www.simpleimageresizer.com/upload
// https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#modifying-network-requests
// Google sheets - Append row API documentation
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
// alert('hi')
// -- Misc learning ---------------------------------------------------------------
// The difference between querySelector() and querySelectorAll() is that querySelector() returns a single object with the first HTML element that matches the 'selectors', but querySelectorAll() returns an array of objects with all the HTML elements that match the 'selectors'.
/*
https://www.w3schools.com/cssref/css_selectors.asp
.class1.class2	.name1.name2	Selects all elements with both name1 and name2 set within its class attribute
.class1 .class2	.name1 .name2	Selects all elements with name2 that is a descendant of an element with name1
element>element	div > p	Selects all <p> elements where the parent is a <div> element
*/
// Enabling Prettier for js/css/html automatic formatting:
// https://www.youtube.com/watch?v=zd_aDbwr4pY&ab_channel=StudyZone
// -- flags ------------------------------------------------------------------------
// - @testing
// Real test cases to monitor: 65220 --> when Test status changes to "tested".
// - @todo
// - @feature
// ---------------------------------------------------------------------------------
// --- Config ----------------------------------------------------------------------
var redmineApiToken = "97f301157f2afdc96676e988ceb58eea2d78602c";
var fieldSchema = [
    {
        fieldName: "status",
        displayName: "Status",
        value: {
            type: "dropdown",
            options: [
                "Pending Approval",
                "New",
                "In Progress",
                "Resolved",
                "Feedback",
            ],
        },
    },
    {
        fieldName: "mr_status",
        displayName: "MR Status",
        value: {
            type: "dropdown",
            options: ["NONE", "WIP", "REVIEW", "DONE"],
        },
    },
    {
        fieldName: "test_status",
        displayName: "Test status",
        value: {
            type: "dropdown",
            options: ["not tested", "tested"],
        },
    },
    {
        fieldName: "deployed_in_sandbox",
        displayName: "Deployed in Sandbox",
        value: {
            type: "dropdown",
            options: ["Empty", "Not empty"],
        },
    },
    {
        fieldName: "deployed_in_live",
        displayName: "Deployed in Live",
        value: {
            type: "dropdown",
            options: ["Empty", "Not empty"],
        },
    },
];
// Global variables
var fieldDiv;
var valueDiv;
var redmineTaskNumberDiv;
var activeAlertIdDiv;
var activeAlertFieldDiv;
var activeAlertValueDiv;
var activeAlertDeleteDiv;
var activeAlertsListDiv;
var addButton;
// --- Helper functions ------------------------------------------------------------
/**
 * @description - Displays all the items in the localStorage
 * @param {object} localStorageItems - Object containing all the items in the localStorage
 * @returns {void}
 */
/*
 * If status is not triggered, then display it.
 * Also add "delete" button.
 */
const displayLocalStorageItems = (localStorageItems) => {
    try {
        activeAlertsListDiv.innerHTML = "";
    }
    catch (error) { }
    ;
    for (let key in localStorageItems) {
        let value = localStorageItems[key];
        if (value.triggeredInThePast === "no") {
            activeAlertsListDiv === null || activeAlertsListDiv === void 0 ? void 0 : activeAlertsListDiv.insertAdjacentHTML("beforeend", `
        <div class="activeAlert flex-container flex">
          <div id="activeAlertId">${key}</div>
          <div id="activeAlertField">${value.fieldToCheck}</div>
          <div id="activeAlertValue">${value.valueToCheck}</div>
          <button id="activeAlertDelete" onclick="deleteItemFromLocalStorage(${key})">Delete</button>
        </div>
      `);
        }
    }
};
// --- Add/Preview/Delete alerts using Local Storage -------------------------------
// --- @testing
let dummyItemObject1TaskID = "64503"; // Currently in mr_status: "REVIEW"
let dummyItemObject1 = {
    itemAddedOnDate: new Date(),
    fieldToCheck: "status",
    valueToCheck: "In progress",
    triggeredInThePast: "no",
    triggeredAtDate: "",
};
// Expected result: Triggered, because status is Resolved.
let dummyItemObject2TaskID = "64503";
let dummyItemObject2 = {
    itemAddedOnDate: new Date(2022, 1, 1),
    fieldToCheck: "mr_status",
    valueToCheck: "DONE",
    triggeredInThePast: "no",
    triggeredAtDate: "",
};
// Expected result: Not triggered, because mr_status is at REVIEW stage.
// @feature
// --> Statuses need to have numbers assigned
/*
Let's say that we're looking for when status == "REVIEW",
but in the span of time when the task status is being checked
it goes from WIP to DONE (or when your PC is turned off
before work).

0 NONE <-- When adding a new item
1 WIP
2 REVIEW <-- Expected
3 DONE <-- Current
*/
const getAndParseLocalStorageItems = () => {
    // Init an object to store all the items
    let localStorageItems = {};
    // Get an array of all the localStorage keys (i.e. task IDs)
    var arrayOfKeys = Object.keys(localStorage);
    // For every key in the array, get the value and display it
    for (let key of arrayOfKeys) {
        try {
            // Console log raw keys and values
            // console.log(key); // log keys
            // console.log(localStorage.getItem(key)); // log values
            let valueString = localStorage.getItem(key);
            let valueObject = JSON.parse(valueString);
            // console.log(
            //   "key: " +
            //     key +
            //     " | " +
            //     "valueObject.fieldToCheck: " +
            //     valueObject.fieldToCheck
            // );
            localStorageItems[key] = valueObject;
        }
        catch (error) {
            console.log("displayLocalStorageItems ERROR: " + error);
        }
    }
    return localStorageItems;
};
// ---------------------------------------------------------------------------------
// --- General ---------------------------------------------------------------------
// Check if the page has loaded before attempting to retrieve values
document.onreadystatechange = function () {
    // --- Adding Field and Value dropdowns --------------------------------------------
    var _a, _b, _c, _d;
    if (document.readyState === "complete") {
        // --- Get divs from the DOM
        // Get field div
        fieldDiv = document.getElementById("field"); // Casting — or more properly, type assertion
        // Get value div
        valueDiv = document.getElementById("addValue");
        // Get redmine task number div
        redmineTaskNumberDiv = document.getElementById("task_id_input");
        // Get active alert id div
        activeAlertIdDiv = document.getElementById("activeAlertId");
        // Get active alert field div
        activeAlertFieldDiv = document.getElementById("activeAlertField");
        // Get active alert value div
        activeAlertValueDiv = document.getElementById("activeAlertValue");
        // Get active alert delete div
        activeAlertDeleteDiv = document.getElementById("activeAlertDelete");
        // Get active alerts div
        activeAlertsListDiv = document.getElementById("activeAlertsList");
        // Get add button
        addButton = document.getElementById("addButton");
        // --- Populate field with schema fieldname and displayname
        fieldSchema.forEach((fieldObject) => {
            // --- Insert "field" dropdown options
            fieldDiv === null || fieldDiv === void 0 ? void 0 : fieldDiv.insertAdjacentHTML("beforeend", `<option value="${fieldObject.fieldName}">${fieldObject.displayName}</option>`);
        });
        // --- Get current Redmine page details --------------------------------------------
        /**
         * If possible (if the currently loaded page is a Redmine task page), then get task
         * details. It needs to happen after the page loads. If the page is not a Redmine
         * task page or it is a support task @feature, then skip this part.
         */
        // -- Auto-fill details from the current development task page data ----------------
        try {
            var taskType;
            // --- Detect project --------------------------------------------------
            // Make sure that parsed keywords in the main text title are avoided.
            // let taskTitle = document.querySelectorAll("head > title").textContent
            /**
             * Input: "Task #63383: ISAC-IS-CORE: Add TransLink field to the Currency Exchange XML Issuer Report - ISAC-ISS - Tribe Payments"
             * Output: " - ISAC-ISS - Tribe Payments"
             */
            let taskTitle = document.title.slice(-28);
            if (taskTitle.includes("Support - ")) {
                taskType = "Support";
            }
            else {
                taskType = "Development";
            }
            // If the project has been found and it is equal to "Development", then try
            // to get other relevant task details.
            if (taskType === "Development") {
                // Task ID
                var redmineTaskNumber = window.location.href
                    .split("/issues/")[1]
                    .substring(0, 5);
                // Status
                var redmineTaskStatus = (_a = document.querySelector(".status.attribute > .value")) === null || _a === void 0 ? void 0 : _a.textContent;
                // MR status
                var redmineMrStatus = (_b = document.querySelector(".cf_26.attribute > .value")) === null || _b === void 0 ? void 0 : _b.textContent;
                // Test status
                var redmineTestStatus = (_c = document.querySelector(".cf_4.attribute > .value")) === null || _c === void 0 ? void 0 : _c.textContent;
                // Deployed to Sandbox status
                // Note: Empty field returns an empty string.
                var redmineDeployedToSandbox = (_d = document.querySelector(".cf_11.attribute > .value")) === null || _d === void 0 ? void 0 : _d.textContent;
                /*
                      console.log(redmineTaskStatus)
                      console.log(redmineTestStatus)
                      console.log(redmineMrStatus)
                      console.log(redmineDeployedToSandbox)
                      */
                // Deployed to Live status
                // --> this is unnecessary, as there are no more assumptions to make if the task
                // is deployed to live
                // -
                // Soft-set input values
                redmineTaskNumberDiv.value = redmineTaskNumber;
            }
            else if (taskType === "Support") {
                // @feature
            }
        }
        catch (error) {
            console.log(error);
        }
        // --- Get initial selected field
        var selectedField = fieldDiv.value;
        // console.log("selectedField log: " + selectedField); //@testing
        // --- Insert "field value" dropdown options
        // Source: https://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
        function removeOptions(selectElement) {
            var i, L = selectElement.options.length - 1;
            for (i = L; i >= 0; i--) {
                selectElement.remove(i);
            }
        }
        function insertOptions(currentlySelectedField) {
            fieldSchema.forEach((fieldObject) => {
                // console.log(`${currentlySelectedField} AND ${fieldObject.fieldName}`); //@testing
                if (currentlySelectedField === fieldObject.fieldName) {
                    if (fieldObject.value.type === "dropdown") {
                        for (let option of fieldObject.value.options) {
                            valueDiv === null || valueDiv === void 0 ? void 0 : valueDiv.insertAdjacentHTML("beforeend", `<option value="${option}">${option}</option>`); // MR name and value matches -> both are "MERGED" for example.
                        }
                    }
                    else if (fieldObject.value.type === "text") {
                        // @feature --> add text input field
                    }
                }
            });
        }
        insertOptions(selectedField);
        // attach a change event listener to the field drop-down
        // Source: https://stackoverflow.com/questions/29802104/javascript-change-drop-down-box-options-based-on-another-drop-down-box-value
        fieldDiv.addEventListener("change", function () {
            removeOptions(valueDiv);
            insertOptions(fieldDiv.value);
            // console.log('fieldDiv: ' + fieldDiv.value); //@testing
            // console.log('valueDiv: ' + valueDiv.value); //@testing
        });
        // --- Display Active alerts on load -----------------------------------------------
        displayLocalStorageItems(getAndParseLocalStorageItems());
        addButton.addEventListener("click", saveItemToLocalStorage());
        // ------------------------------------------------------------------------------------
        // --- End of General -----------------------------------------------------------------
    }
    ;
};
// // --- Validate data ---------------------------------------------------------------
// @notMvp - fields are predefined except for task ID
// // // -- 'Add task' button availability (disabled if input is not valid)
// // // Disabled by default. Enabled when validation is passed.
// // var buttonIsDisabled = true;
// // // -- Validate "Task ID" input
// // if (
// //   (RedmineTaskNumber.length !== 5 && RedmineTaskNumber !== "") ||
// //   isNaN(RedmineTaskNumber)
// // ) {
// //   // isNaN checks if the value is a number
// //   // How to add a warning message to the input field: https://stackoverflow.com/questions/18954388/how-to-display-error-message-next-to-textbox-in-javascript
// //   // inputPropsRedmineTaskNumber.helperText = 'Incorrect value';
// // } else {
// //   // inputPropsRedmineTaskNumber.helperText = '';
// //   buttonIsDisabled = false;
// // }
// // ---------------------------------------------------------------------------------
// // --- User analytics --------------------------------------------------------------
// @notMvp - for my own use only at first
// // -- User ID (for user analytics)
// /** Send data whenever a user creates a new alert.
//  *
//  *
//  */
// // User ID
// // Try because
// // the user might not be in the Development task page
// try {
//   var userLink = document.querySelector("#loggedas a").textContent;
//   var userID = userLink.match(/(\d*)$/i)[0];
//   // Send data to Google sheet (TODO create statistics sheet and test writing to it.)
//   // ID are mapped in the Google sheet
//   let body = {
//     [new Date().getTime()]: {
//       date: new Date(),
//       redmineTaskNumber: userID,
//       redmineTaskStatus: RedmineTaskNumber,
//       redmineMrStatus: RedmineTaskStatus,
//       redmineTestStatus: RedmineTaskStatus,
//       redmineDeployedToSandboxStatus: RedmineTaskStatus,
//     },
//   };
//   // select where body.id = "1384185442"
//   // fetch('https://example.com') // POST
//   // include credentials: true
// } catch (error) {
//   //   console.log(error);
// }
// // ---------------------------------------------------------------------------------
displayLocalStorageItems(getAndParseLocalStorageItems());
/**
 * @description - This function is not called anywhere at the moment.
 */
const clearLocalStorage = () => {
    localStorage.clear();
};
// Save Item
/* localStorage.setItem(key, value); */
function saveItemToLocalStorage() {
    // Build object with most recent data
    let itemObject = {
        itemAddedOnDate: new Date(),
        fieldToCheck: fieldDiv.value,
        valueToCheck: valueDiv.value,
        triggeredInThePast: "no",
        triggeredAtDate: "",
    };
    let itemObjectString = JSON.stringify(itemObject);
    /*
    @param {string} key name
    @param {string} value
    */
    localStorage.setItem(redmineTaskNumberDiv.value, itemObjectString);
    displayLocalStorageItems(getAndParseLocalStorageItems());
    // Clear input fields
    redmineTaskNumberDiv.value = "";
    // Refresh "Active alerts" display list
}
// Retrieve
// document.querySelector("#issue_notes").value =
//   localStorage.getItem(RedmineTaskNumber);
/**
 * @description - This function is called when "Delete" button is clicked.
 * @param {string} taskID
 * Local storage docs: https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
function deleteItemFromLocalStorage(redmineTaskNumber) {
    localStorage.removeItem(redmineTaskNumber);
    // Refresh "Active alerts" display list
    displayLocalStorageItems(getAndParseLocalStorageItems());
}
// ---------------------------------------------------------------------------------
// // --- Send a request to Redmine every 3 minutes -----------------------------------
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
// @testing task IDs
// 64448 - Resolved - not tested - DONE - Empty - Empty
// 66453 - Resolved - not tested - DONE - Empty - Empty
// 50245 - New      - not tested - Closed - Empty - Empty
// Extension script CORS privilege:
// https://stackoverflow.com/questions/48615701/why-can-tampermonkeys-gm-xmlhttprequest-perform-a-cors-request
const sendRequest = async (taskId) => {
    try {
        const redmineResponse = await fetch(`https://redmine.tribepayments.com/issues/${taskId}.json`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-Redmine-API-Key": redmineApiToken,
            },
            body: null,
        });
        return redmineResponse;
    }
    catch (error) {
        console.log("ERROR in sendRequest func" + error);
        return "ERROR in sendRequest func";
    }
};
setInterval(async () => {
    console.log("something is happening");
    // for each item in localStorage with status triggeredInThePast == "no"
    let localStorageItems = getAndParseLocalStorageItems();
    for (let key in localStorageItems) {
        if (localStorageItems[key].triggeredInThePast === "no") {
            sendRequest(key);
            console.log(key); // @testing
            console.log("something"); // @testing
            await sleep(300);
        }
    }
}, 5000); // @testing - 5 seconds
// }, 180000); // 3 minutes
// Raise an alert via Desktop notification
// @feature - can add text with changes what happened to the ticket
function raiseAlert(taskId) {
    // Source for notification standard: https://notifications.spec.whatwg.org/#using-events
    var _a;
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(`
        Task ID: ${taskId} has triggered an alert.
      `);
        (_a = window
            .open(`https://redmine.tribepayments.com/issues/${taskId}`, "_blank")) === null || _a === void 0 ? void 0 : _a.focus();
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                // var notification = new Notification("Hi there!");
            }
        });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
    // // Plan B:
    // // Open Window on pop-up:
    // window.open(`https://redmine.tribepayments.com/issues/${taskId}`, '_blank')?.focus();
    // // Do not allow to close window without confirming:
    // window.addEventListener('beforeunload', function (e) {
    //   // Cancel the event
    //   e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    //   // Chrome requires returnValue to be set
    //   e.returnValue = '';
    // });
}
// --- Comparing values to Local Storage --------------------------------------------
// // Need to handle (when sending only. Writing and reading to memory is raw.)
// options: [
//   "Empty",
//   "Not empty"
// ],
// function checkIfTriggerred() {
//   // Get value from local storage
//   // Display value in the DOM
//   var addValueDiv = document
//     .querySelector("#addValue")
//     .appendChild(document.createElement("<hr>"));
//   // Source: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
//   // document.createElement('block').appendChild( document.createElement('b') );
//   // <option value="status">-</option>
// }
// ---------------------------------------------------------------------------------
/*
------------------------------------------------------------------------------
--- ARCHIVE ------------------------------------------------------------------
------------------------------------------------------------------------------

var dummyDataLocalStorage1 = {
  [new Date().getTime()]: {
    itemAddedOnDate: new Date("08/02/2022"),
    redmineTaskNumber: "61253",
    redmineTaskStatus: "Resolved",
    redmineMrStatus: "NONE",
    redmineTestStatus: "not tested",
    redmineDeployedToSandboxStatus: "",
    triggeredInThePast: "yes",
    triggeredAtDate: "08/02/2022",
  },
  [new Date().getTime() - 2563]: {
    date: new Date("06/02/2022"),
    redmineTaskNumber: "61685",
    redmineTaskStatus: "In progress",
    redmineMrStatus: "WIP",
    redmineTestStatus: "not tested",
    redmineDeployedToSandboxStatus: "",
    triggered: "no",
  },
};

*/
