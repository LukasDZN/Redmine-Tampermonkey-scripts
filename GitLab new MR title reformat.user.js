// ==UserScript==
// @name         GitLab new MR title reformat
// @version      0.1
// @description  Reformat GitLab new MR title automatically
// @author       ld
// @match        https://git.tribepayments.com/*/*/-/merge_requests/new?merge_request*
// @grant        none
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/GitLab%20new%20MR%20title%20reformat.user.js
// @updateURL    https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/GitLab%20new%20MR%20title%20reformat.user.js
// ==/UserScript==

(function() {
    'use strict';

// Read the title value
var initialTitleValue = document.getElementById('merge_request_title').value

// Process title value
var sliceOne = initialTitleValue.slice(0, 7)
var sliceTwo = initialTitleValue.slice(15)
var processedTitle = sliceOne + '#' + sliceTwo.slice(1) // slicing adds a space in between, therefore sliceTwo is sliced twice.

// Set title value
document.getElementById('merge_request_title').value = (processedTitle)

})();