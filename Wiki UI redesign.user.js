// ==UserScript==
// @name         Wiki UI redesign
// @version      0.1
// @author       ld
// @match        https://redmine.tribepayments.com/projects/*/wiki*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/LukasDZN/Redmine-Tampermonkey-scripts/main/Wiki%20UI%20redesign.user.js
// @grant        GM_addStyle
// ==/UserScript==

var $ = window.jQuery;

//-------------------------- WIKI INDEX PAGE --------------------------------

GM_addStyle(`
#header {
   background: rgb(2,0,36);
   background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(136,0,255,1) 100%);
}

.wiki.wiki-page {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    font-family: "Inter", sans-serif;
    font-size: 18px;
    text-align: left;
}

.wiki.wiki-page h1 {
    font-size: 35px;
}

.wiki.wiki-page h2 {
    font-size: 25px;
}

.wiki.wiki-page h3 {
    font-size: 20px;
}

.wiki.wiki-page a {
    line-height: 1.6;
}

.wiki.wiki-page a:hover {
    text-decoration: none;
    color: darkblue;
    -webkit-text-stroke: 1px darkblue;
}
`);

// Removing unncessary elements
let removeClassesList = [".wiki-anchor", "#footer"]
removeClassesList.forEach(className => document.querySelectorAll(className).forEach(e => e.remove()));

//-------------------------- WIKI INNER PAGE --------------------------------

GM_addStyle(`
textarea#content_text {
    font-size: 18px !important;
    font-family: "Inter", sans-serif!important;
    }
`);

// Wrapping text (sometimes if there's preformatted text in the description,
// it creates a long horizontal scrollbar which is difficult to read.

GM_addStyle(`
div.wiki pre {
    word-wrap: normal;
    white-space: pre-wrap;
    background-color: #fff;
    }
`);