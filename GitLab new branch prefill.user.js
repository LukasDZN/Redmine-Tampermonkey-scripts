// ==UserScript==
// @name         GitLab new branch prefill
// @version      0.1
// @description  Fill in GitLab new branch automatically
// @author       ld
// @match        https://git.tribepayments.com/*/*/-/branches/new
// @grant        none
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/GitLab%20new%20branch%20prefill.user.js
// @updateURL    https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/GitLab%20new%20branch%20prefill.user.js
// ==/UserScript==

(function() {
    'use strict';

// Path to look for: https://git.tribepayments.com/*/*/-/branches/new
// DOM field ID: branch_name
// Desired branch template: YYYYMMDD_TASKNUMBER_title_titlealso

// Get today's date
var todayFullDate = new Date(); // Thu Aug 04 2022 10:37:13 GMT+0300 (Eastern European Summer Time)
var todayWithDashes = todayFullDate.toISOString().substring(0, 10); // '2022-08-04'
var todayFormated = todayWithDashes.replace(/-/g,''); // '20220804' (the / /g replaces all occurrences instead of 1)

// Fill template
var branchName = todayFormated + '_TASKNUMBER_TITLE_TITLEALSO';

// Filling in the template value into the text field
document.getElementById('branch_name').value = (branchName)

})();