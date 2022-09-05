// ==UserScript==
// @name         Docbox front
// @version      0.1
// @description  Testing Docbox styles with saving.
// @author       ld
// @match        https://doc.tribepayments.com/docs/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    // Newest CSS on top
    
    GM_addStyle(`
    
    
    td > code {
        /* background-color: white; */
        border-radius: 6px;
        box-shadow: rgb(0 0 0 / 16%) 0px 3px 8px;
        margin: 6px;
        padding: 3px;
        color: #c73d7d;
        font-weight: 500;
    }
    
    html.dark-mode td > code {
        box-shadow: rgb(255 255 255 / 30%) 0px 3px 8px;
    }
    
    
    
    /* Doesn't work for some reason */
    a > code {
        text-decoration: underline;
        text-underline-position: under;
    }
    
    p > a:hover {
        color: #572c5f;
    }
    
    
    
    
    /*
    td > code {
        margin-left: 3px;
        margin-right: 3px;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 3px;
        overflow: hidden;
        border: 1px lightgray solid;
        border-color: #9c9c9c;
        background: #f0f0f0;
        color: #C52761;
    }
    */
    
    
    
    
    /*
    body {
        /* font-weight: 400; */
        font-family: Roboto;
    }
    */
    
    
    
    
    /*
    table th {
        font-weight: 500;
    }
    */
    
    
    `);
    
    
    
    })();