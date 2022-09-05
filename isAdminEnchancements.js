// ==UserScript==
// @name         IS-ADMIN
// @version      0.1
// @description  IS-ADMIN temporary improvements
// @author       ld
// @match        https://is-admin.isaac-sandbox.tribepayments.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribepayments.com
// @grant        GM_addStyle
// ==/UserScript==
//// @match        https://is-admin.*.tribepayments.com/*
(function() {
    'use strict';

    GM_addStyle(`


span.select2-dropdown.select2-dropdown--below {
    width: max-content!important;
}


`
)

    console.log("hello world");

})();