// ==UserScript==
// @name         Wiki UI redesign
// @version      1.0.1
// @author       ld
// @match        https://redmine.tribepayments.com/projects/*/wiki*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/Wiki%20UI%20redesign.user.js
// @run-at       document-start
// ==/UserScript==

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
        max-width: 800px;
        font-family: "Inter", sans-serif;
        font-size: 16px;
        text-align: left;
    }

    .wiki.wiki-page h1 {
        font-size: 28px;
    }

    .wiki.wiki-page h2 {
        font-size: 22px;
    }

    .wiki.wiki-page h3 {
        font-size: 18px;
    }

    .wiki.wiki-page a {
        line-height: 1.5;
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

    `);

//-------------------------- WIKI INNER PAGE --------------------------------

GM_addStyle(`
textarea#content_text {
    font-size: 15px !important;
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

// ----------------- Beautify the Edit button -------------------------------

GM_addStyle(`
.fill, input[type="submit"] {
    all: initial !important;
    font-family: courier,arial,helvetica !important;
    margin: 50px 7px 0px 7px !important;
    font-size: 16px !important;
    font-weight: 200 !important;
    letter-spacing: 0px !important;
    padding: 10px 7px 10px 7px !important;
    outline: 0 !important;
    border: 1px solid black !important;
    cursor: pointer !important;
    position: relative !important;
    background-color: transparent !important;
    z-index: 0 !important;
    zoom: 0.15
    }
.fill::after {
    content: "" !important;
    background-color: #ffe54c !important;
    width: 100% !important;
    position: absolute !important;
    z-index: -1 !important;
    height: 100% !important;
    top: 6px !important;
    left: 6px !important;
    transition: 0.15s !important;
    }
.fill:hover::after {
    top: 0px !important;
    left: 0px !important;
    }
`);

var $ = window.jQuery;

// Removing the export as html, pdf, csv hyperlinks
$("p.other-formats").remove()
// Prettify the Edit button
$("#content > div:nth-child(1) > a.icon.icon-edit").addClass("fill");

// Removing unncessary elements
let removeClassesList = [".wiki-anchor", "#footer"]
removeClassesList.forEach(className => document.querySelectorAll(className).forEach(e => e.remove()));