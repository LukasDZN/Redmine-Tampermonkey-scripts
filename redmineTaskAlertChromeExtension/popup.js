"use strict";
// @ts-nocheck
// Imports
// Make the dropdowns searchable (must be initiated after data is added)
// Source: https://bluzky.github.io/nice-select2/
// Library code
!function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.NiceSelect = t() : e.NiceSelect = t(); }(self, (function () { return (() => {
    "use strict";
    var e = { d: (t, i) => { for (var s in i)
            e.o(i, s) && !e.o(t, s) && Object.defineProperty(t, s, { enumerable: !0, get: i[s] }); }, o: (e, t) => Object.prototype.hasOwnProperty.call(e, t), r: e => { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }); } }, t = {};
    function i(e) { var t = document.createEvent("MouseEvents"); t.initEvent("click", !0, !1), e.dispatchEvent(t); }
    function s(e) { var t = document.createEvent("HTMLEvents"); t.initEvent("change", !0, !1), e.dispatchEvent(t); }
    function o(e) { var t = document.createEvent("FocusEvent"); t.initEvent("focusin", !0, !1), e.dispatchEvent(t); }
    function n(e) { var t = document.createEvent("FocusEvent"); t.initEvent("focusout", !0, !1), e.dispatchEvent(t); }
    function d(e, t) { return e.getAttribute(t); }
    function r(e, t) { return !!e && e.classList.contains(t); }
    function l(e, t) { if (e)
        return e.classList.add(t); }
    function a(e, t) { if (e)
        return e.classList.remove(t); }
    e.r(t), e.d(t, { default: () => p, bind: () => u });
    var c = { data: null, searchable: !1 };
    function p(e, t) { this.el = e, this.config = Object.assign({}, c, t || {}), this.data = this.config.data, this.selectedOptions = [], this.placeholder = d(this.el, "placeholder") || this.config.placeholder || "Select an option", this.dropdown = null, this.multiple = d(this.el, "multiple"), this.disabled = d(this.el, "disabled"), this.create(); }
    function u(e, t) { return new p(e, t); }
    return p.prototype.create = function () { this.el.style.display = "none", this.data ? this.processData(this.data) : this.extractData(), this.renderDropdown(), this.bindEvent(); }, p.prototype.processData = function (e) { var t = []; e.forEach((e => { t.push({ data: e, attributes: { selected: !1, disabled: !1, optgroup: "optgroup" == e.value } }); })), this.options = t; }, p.prototype.extractData = function () { var e = this.el.querySelectorAll("option,optgroup"), t = [], i = [], s = []; e.forEach((e => { if ("OPTGROUP" == e.tagName)
        var s = { text: e.label, value: "optgroup" };
    else
        s = { text: e.innerText, value: e.value }; var o = { selected: null != e.getAttribute("selected"), disabled: null != e.getAttribute("disabled"), optgroup: "OPTGROUP" == e.tagName }; t.push(s), i.push({ data: s, attributes: o }); })), this.data = t, this.options = i, this.options.forEach((function (e) { e.attributes.selected && s.push(e); })), this.selectedOptions = s; }, p.prototype.renderDropdown = function () { var e = `<div class="${["nice-select", d(this.el, "class") || "", this.disabled ? "disabled" : "", this.multiple ? "has-multiple" : ""].join(" ")}" tabindex="${this.disabled ? null : 0}">\n  <span class="${this.multiple ? "multiple-options" : "current"}"></span>\n  <div class="nice-select-dropdown">\n  ${this.config.searchable ? '<div class="nice-select-search-box">\n<input type="text" class="nice-select-search" placeholder="Search..."/>\n</div>' : ""}\n  <ul class="list"></ul>\n  </div></div>\n`; this.el.insertAdjacentHTML("afterend", e), this.dropdown = this.el.nextElementSibling, this._renderSelectedItems(), this._renderItems(); }, p.prototype._renderSelectedItems = function () { if (this.multiple) {
        var e = "";
        "auto" == window.getComputedStyle(this.dropdown).width || this.selectedOptions.length < 2 ? (this.selectedOptions.forEach((function (t) { e += `<span class="current">${t.data.text}</span>`; })), e = "" == e ? this.placeholder : e) : e = this.selectedOptions.length + " selected", this.dropdown.querySelector(".multiple-options").innerHTML = e;
    }
    else {
        var t = this.selectedOptions.length > 0 ? this.selectedOptions[0].data.text : this.placeholder;
        this.dropdown.querySelector(".current").innerHTML = t;
    } }, p.prototype._renderItems = function () { var e = this.dropdown.querySelector("ul"); this.options.forEach((t => { e.appendChild(this._renderItem(t)); })); }, p.prototype._renderItem = function (e) { var t = document.createElement("li"); if (t.innerHTML = e.data.text, e.attributes.optgroup)
        t.classList.add("optgroup");
    else {
        t.setAttribute("data-value", e.data.value);
        var i = ["option", e.attributes.selected ? "selected" : null, e.attributes.disabled ? "disabled" : null];
        t.addEventListener("click", this._onItemClicked.bind(this, e)), t.classList.add(...i);
    } return e.element = t, t; }, p.prototype.update = function () { if (this.extractData(), this.dropdown) {
        var e = r(this.dropdown, "open");
        this.dropdown.parentNode.removeChild(this.dropdown), this.create(), e && i(this.dropdown);
    } }, p.prototype.disable = function () { this.disabled || (this.disabled = !0, l(this.dropdown, "disabled")); }, p.prototype.enable = function () { this.disabled && (this.disabled = !1, a(this.dropdown, "disabled")); }, p.prototype.clear = function () { this.selectedOptions = [], this._renderSelectedItems(), this.updateSelectValue(), s(this.el); }, p.prototype.destroy = function () { this.dropdown && (this.dropdown.parentNode.removeChild(this.dropdown), this.el.style.display = ""); }, p.prototype.bindEvent = function () { this.dropdown.addEventListener("click", this._onClicked.bind(this)), this.dropdown.addEventListener("keydown", this._onKeyPressed.bind(this)), this.dropdown.addEventListener("focusin", o.bind(this, this.el)), this.dropdown.addEventListener("focusout", n.bind(this, this.el)), window.addEventListener("click", this._onClickedOutside.bind(this)), this.config.searchable && this._bindSearchEvent(); }, p.prototype._bindSearchEvent = function () { var e = this.dropdown.querySelector(".nice-select-search"); e && e.addEventListener("click", (function (e) { return e.stopPropagation(), !1; })), e.addEventListener("input", this._onSearchChanged.bind(this)); }, p.prototype._onClicked = function (e) { if (this.multiple ? this.dropdown.classList.add("open") : this.dropdown.classList.toggle("open"), this.dropdown.classList.contains("open")) {
        var t = this.dropdown.querySelector(".nice-select-search");
        t && (t.value = "", t.focus());
        var i = this.dropdown.querySelector(".focus");
        a(i, "focus"), l(i = this.dropdown.querySelector(".selected"), "focus"), this.dropdown.querySelectorAll("ul li").forEach((function (e) { e.style.display = ""; }));
    }
    else
        this.dropdown.focus(); }, p.prototype._onItemClicked = function (e, t) { var i = t.target; r(i, "disabled") || (this.multiple ? r(i, "selected") ? (a(i, "selected"), this.selectedOptions.splice(this.selectedOptions.indexOf(e), 1), this.el.querySelector('option[value="' + i.dataset.value + '"]').selected = !1) : (l(i, "selected"), this.selectedOptions.push(e)) : (this.selectedOptions.forEach((function (e) { a(e.element, "selected"); })), l(i, "selected"), this.selectedOptions = [e]), this._renderSelectedItems(), this.updateSelectValue()); }, p.prototype.updateSelectValue = function () { if (this.multiple) {
        var e = this.el;
        this.selectedOptions.forEach((function (t) { var i = e.querySelector('option[value="' + t.data.value + '"]'); i && i.setAttribute("selected", !0); }));
    }
    else
        this.selectedOptions.length > 0 && (this.el.value = this.selectedOptions[0].data.value); s(this.el); }, p.prototype._onClickedOutside = function (e) { this.dropdown.contains(e.target) || this.dropdown.classList.remove("open"); }, p.prototype._onKeyPressed = function (e) { var t = this.dropdown.querySelector(".focus"), s = this.dropdown.classList.contains("open"); if (32 == e.keyCode || 13 == e.keyCode)
        i(s ? t : this.dropdown);
    else if (40 == e.keyCode) {
        if (s) {
            var o = this._findNext(t);
            o && (a(this.dropdown.querySelector(".focus"), "focus"), l(o, "focus"));
        }
        else
            i(this.dropdown);
        e.preventDefault();
    }
    else if (38 == e.keyCode) {
        if (s) {
            var n = this._findPrev(t);
            n && (a(this.dropdown.querySelector(".focus"), "focus"), l(n, "focus"));
        }
        else
            i(this.dropdown);
        e.preventDefault();
    }
    else
        27 == e.keyCode && s && i(this.dropdown); return !1; }, p.prototype._findNext = function (e) { for (e = e ? e.nextElementSibling : this.dropdown.querySelector(".list .option"); e;) {
        if (!r(e, "disabled") && "none" != e.style.display)
            return e;
        e = e.nextElementSibling;
    } return null; }, p.prototype._findPrev = function (e) { for (e = e ? e.previousElementSibling : this.dropdown.querySelector(".list .option:last-child"); e;) {
        if (!r(e, "disabled") && "none" != e.style.display)
            return e;
        e = e.previousElementSibling;
    } return null; }, p.prototype._onSearchChanged = function (e) { var t = this.dropdown.classList.contains("open"), i = e.target.value; if ("" == (i = i.toLowerCase()))
        this.options.forEach((function (e) { e.element.style.display = ""; }));
    else if (t) {
        var s = new RegExp(i);
        this.options.forEach((function (e) { var t = e.data.text.toLowerCase(), i = s.test(t); e.element.style.display = i ? "" : "none"; }));
    } this.dropdown.querySelectorAll(".focus").forEach((function (e) { a(e, "focus"); })), l(this._findNext(null), "focus"); }, t;
})(); }));
// Set options
var options = { searchable: true };
// Global variables
var fieldDiv;
var valueDiv;
var redmineTaskNumberDiv;
var activeAlertIdDiv;
var activeAlertFieldDiv;
var activeAlertValueDiv;
var activeAlertDeleteDiv;
var activeAlertsListDiv;
var triggeredAlertsListDiv;
var addButton;
var clearButton;
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
        triggeredAlertsListDiv.innerHTML = "";
    }
    catch (error) { }
    for (let key in localStorageItems) {
        try {
            let value = localStorageItems[key];
            if (value.triggeredInThePast === "no") {
                activeAlertsListDiv?.insertAdjacentHTML("beforeend", `
            <div class="activeAlert flex-container flex">
              <div id="activeAlertId">${key}</div>
              <div id="activeAlertField">${value.fieldToCheck}</div>
              <div id="activeAlertValue">${value.valueToCheck}</div>
              <button id="activeAlertDelete${key}" >Delete</button>
            </div>
          `);
                let deleteButton = document.getElementById(`activeAlertDelete${key}`);
                deleteButton.addEventListener("click", () => deleteItemFromLocalStorage(key));
            }
            else if (value.triggeredInThePast === "yes") {
                triggeredAlertsListDiv?.insertAdjacentHTML("beforeend", `
            <div class="activeAlert flex-container flex">
              <div id="activeAlertId">${key}</div>
              <div id="activeAlertField">${value.fieldToCheck}</div>
              <div id="activeAlertValue">${value.valueToCheck}</div>
              <div id="activeAlertValue">${value.triggeredAtDate}</div>
            </div>
          `);
            }
        }
        catch (error) { }
    }
};
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
            console.log("key: " +
                key +
                " | " +
                "valueObject.fieldToCheck: " +
                valueObject.fieldToCheck +
                " | " +
                "triggered in the past?: " +
                valueObject.triggeredInThePast);
            localStorageItems[key] = valueObject;
        }
        catch (error) {
            console.log("displayLocalStorageItems ERROR: " + error);
        }
    }
    return localStorageItems;
};
// Detecting active chrome tab (href does not work for extensions)
// Source: https://stackoverflow.com/questions/54821584/chrome-extension-code-to-get-current-active-tab-url-and-detect-any-url-update-in
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
// chrome.storage.sync.set({key: value}, function() {
//   console.log('Value is set to ' + value);
// });
// Check if initial storage.local object exists, if not - initialize it
// It is initialized here and not in background.js because the user will always open the extension first
// after downloading it.
// function initializeStorageLocalObject() {
//   chrome.storage.sync.get(['redmineNotificationExtension'], function(result) {
//     if (!result.value) {
//       chrome.storage.sync.set({'redmineNotificationExtension': []}, function() {
//         console.log('local.storage initial value set.');
//       });
//     }
//   });
// }
// chrome.storage.sync.get(['key'], function(result) {
//   console.log('Value currently is ' + result.key);
// });
// function getStorageLocalObject() {
//   chrome.storage.sync.get(['key'], function(result) {
//     console.log('Value currently is ' + result.key);
//   });
//   return storageLocalObject;
// };
const getStorageLocalObject = () => {
    // Init an object to store all the items
    let localStorageItems = {};
    // Get an array of all the localStorage keys (i.e. task IDs)
    var arrayOfKeys = Object.keys(localStorage);
    // For every key in the array, get the value and display it
    for (let key of arrayOfKeys) {
        let valueString = localStorage.getItem(key);
        let valueObject = JSON.parse(valueString);
        localStorageItems[key] = valueObject;
    }
    return localStorageItems;
};
/**
 * @description - This function is not called anywhere at the moment.
 */
const clearChromeStorageSync = () => {
    // https://stackoverflow.com/questions/31812937/how-to-clear-chrome-storage-local-and-chrome-storage-sync
    chrome.storage.sync.clear();
    console.log("chrome.storage.sync was cleared...");
};
document.querySelector("#version")?.addEventListener("click", function () {
    clearChromeStorageSync();
});
// chrome.storage.sync.get(null, function (data) { console.info(data) });
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
// --- Get divs from the popup.html DOM
fieldDiv = document.getElementById("field"); // Casting — or more properly, type assertion
valueDiv = document.getElementById("addValue");
redmineTaskNumberDiv = document.getElementById("task_id_input");
activeAlertIdDiv = document.getElementById("activeAlertId");
activeAlertFieldDiv = document.getElementById("activeAlertField");
activeAlertValueDiv = document.getElementById("activeAlertValue");
activeAlertDeleteDiv = document.getElementById("activeAlertDelete");
activeAlertsListDiv = document.getElementById("activeAlertsList");
triggeredAlertsListDiv = document.getElementById("triggeredAlertsList");
addButton = document.getElementById("addButton");
clearButton = document.getElementById("clearButton");
// getAndPrefillActiveTabRedmineTaskNumber(redmineTaskNumberDiv)
// Fill "Field" dropdown options ("Values" are filled when "Field" is selected.)
// NiceSelect.bind(document.getElementById("addValue"), options);
function setRedmineTaskDropdownFields() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "parseRedmineTaskDropdownFieldsToArrayOfObjects", function (response) {
            response.data.forEach((fieldObject) => {
                fieldDiv?.insertAdjacentHTML("beforeend", `<option value="${fieldObject.id}">${fieldObject.label}</option>`);
            });
            NiceSelect.bind(document.getElementById("field"), options);
        });
    });
}
setRedmineTaskDropdownFields();
function getAndSetActiveTabRedmineTaskNumber(htmlElement) {
    if (htmlElement) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let redmineTaskNumber = tabs[0].url.split("/issues/")[1].substring(0, 5);
            htmlElement.value = redmineTaskNumber;
        });
    }
}
getAndSetActiveTabRedmineTaskNumber(redmineTaskNumberDiv);
// // --- Get initial selected field
// var selectedField = fieldDiv.value;
// // --- Insert "field value" dropdown options
// // Source: https://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
// function removeOptions(selectElement: any) {
//   var i,
//     L = selectElement.options.length - 1;
//   for (i = L; i >= 0; i--) {
//     selectElement.remove(i);
//   }
// }
// function insertOptions(currentlySelectedField: string) {
//   fieldSchema.forEach((fieldObject) => {
//     // console.log(`${currentlySelectedField} AND ${fieldObject.fieldName}`); //@testing
//     if (currentlySelectedField === fieldObject.displayName) {
//       if (fieldObject.value.type === "dropdown") {
//         for (let option of fieldObject.value.options) {
//           valueDiv?.insertAdjacentHTML(
//             "beforeend",
//             `<option value="${option}">${option}</option>`
//           ); // MR name and value matches -> both are "MERGED" for example.
//         }
//       } else if (fieldObject.value.type === "text") {
//         // @feature --> add text input field
//       }
//     }
//   });
// }
// insertOptions(selectedField);
// // attach a change event listener to the field drop-down
// // Source: https://stackoverflow.com/questions/29802104/javascript-change-drop-down-box-options-based-on-another-drop-down-box-value
// fieldDiv.addEventListener("change", function () {
//   removeOptions(valueDiv);
//   insertOptions(fieldDiv.value);
// });
// // --- Display Active alerts on load -----------------------------------------------
// displayLocalStorageItems(getAndParseLocalStorageItems());
// addButton.addEventListener("click", () => saveItemToLocalStorage());
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
// displayLocalStorageItems(getAndParseLocalStorageItems());
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
    // Refresh "Active alerts" display list
    displayLocalStorageItems(getAndParseLocalStorageItems());
    // Clear input fields
    redmineTaskNumberDiv.value = "";
}
// Retrieve
// document.querySelector("#issue_notes").value =
//   localStorage.getItem(RedmineTaskNumber);
/**
 * @description - This function is called when "Delete" button is clicked.
 * @param {string} taskID
 */
function deleteItemFromLocalStorage(redmineTaskNumber) {
    localStorage.removeItem(redmineTaskNumber);
    // Refresh "Active alerts" display list
    displayLocalStorageItems(getAndParseLocalStorageItems());
}
// var myWorker = new Worker('background.js');
// // note: service workers logs results to popup console
// // send message
// myWorker.postMessage(''); // meant for keeping the worker alive
