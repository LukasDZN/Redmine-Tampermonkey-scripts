// ==UserScript==
// @name         Spent time type autofill
// @version      0.1
// @description  Spent time type autofill to "Other"
// @author       You
// @match        https://redmine.tribepayments.com/issues/*/time_entries/new*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

// Filling in the value into the text field
document.getElementById('time_entry_activity_id').value = ('10')

})();