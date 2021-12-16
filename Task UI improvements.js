// ==UserScript==
// @name         Task UI improvements
// @version      0.3
// @author       ld
// @match        redmine.tribepayments.com/issues/1*
// @match        redmine.tribepayments.com/issues/2*
// @match        redmine.tribepayments.com/issues/3*
// @match        redmine.tribepayments.com/issues/4*
// @match        redmine.tribepayments.com/issues/5*
// @match        redmine.tribepayments.com/issues/6*
// @match        redmine.tribepayments.com/issues/7*
// @match        redmine.tribepayments.com/issues/8*
// @match        redmine.tribepayments.com/issues/9*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/LukasDZN/Redmine-Tampermonkey-scripts/main/UI%20improvements.js
// @grant        GM_addStyle
// ==/UserScript==


var $ = window.jQuery;

//-------------------------- REMOVING UI ELEMENTS --------------------------------

let removeClassesList = [".icon-time-add", ".icon-comment", ".next-prev-links", "#content > p", "#main-menu > ul", "#top-menu > ul > li:nth-child(1) > a", "#top-menu > ul > li:nth-child(4) > a"];
removeClassesList.forEach(className => document.querySelectorAll(className).forEach(e => e.remove()));

document.querySelectorAll('#add_to_important_list').forEach(e => e.remove());

// Make the text in the footer invisible (need footer in order for the copy button to work

GM_addStyle(`
.whiteText {
    color: white;
}
`);

$("#footer").addClass("whiteText");

// "My page" and "Projects" hyperlink style -------------------------------------

/*
GM_addStyle(`
.topMenuStyle {
    font-family: "Inter", sans-serif;
    font-size: 0.7 vw !important;
}
`);

$("#top-menu").addClass("topMenuStyle");
*/

// --------------- SEARCH BAR LENGTHENING ----------------------------------------

GM_addStyle(`
.searchLength {
    width: 50vw !important;
}
`);

$("#q").addClass("searchLength");

// ---------------------------- BUTTONS -----------------------------------------

GM_addStyle(`
/* optional - add  "input[type="submit"]' as a selector below in order to style the submit button */
.fill {
    font-family: "Inter", sans-serif!important;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.15385;
    background-color: #e1ecf4;
    border-radius: 5px;
    border: 1px solid #7aa7c7;
    box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
    box-sizing: border-box;
    color: #0d3d61;
    cursor: pointer;
    display: inline-block;
    margin: 0;
    max-width: 200px;
    padding: 0.5vw .8em;
    outline: none;
    position: relative;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    white-space: nowrap;
    box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.03);
}

.fill:hover,
.fill:focus {
    color: #2c5777;
    text-decoration: none;
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
    /* -webkit-text-stroke: 0.03vw #0d3d61; */
    }

.assignToMe {
    background-color: #D5F5E3;
    }
.statusInProgressTM {
    background-color: #F9E79F;
    }
.PendingApp {
    background-color: #EDBB99;
    }
.Resolved {
    background-color: #85C1E9;
    }
.PendingMd {
    background-color: #EBDEF0;
    }

/* Submit button */
/*
input[type="submit"] {
    background-color: #D5F5E3;
}
*/
`);

/* Notes:
- !important is necessary to override all elements -> using CSS id and all:initial; doesn't fully help.
*/

let buttonStyleLib = $(`
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
`);
$("head").prepend(buttonStyleLib)

// Good font example https://developer.mozilla.org/en-US/docs/Web/CSS/::after --> search for "Simple usage"

// --------------------------------------------------------------

// All button location (top bar)
let buttonLocation = $("#content > h2");

// --------------------------- COPY feature next to task title --------------------------

GM_addStyle(`

.buttonToCopy {
    background-color: #F5F5F5 !important;
}

.flashBG {
    margin-right: 10vh !important;
    margin-left: 1vh !important;
}

`);

/**
 * Button to copy task hyperlink to clipboard
 */

$(function copyButton() {
    // Identify div to add the button to
    let taskName = $("#content > h2");

    // Preparing content to write to clipboard
    let pageUrl = window.location.href;
    let taskTitle = $("head > title").text().slice(0, -17); // Turn header element into text, then remove " - TribePayments" part of the string

    // Create a hyperlink
    $("#footer").append(`<a href="${pageUrl}" style="color: white">${taskTitle}</a>`)

    // This is a working solution that copies a hyperlink, but need to understand how it works | Source: https://stackoverflow.com/questions/53003980/how-to-copy-a-hypertext-link-into-clipboard-with-javascript-and-preserve-its-lin
    const onClick = evt => {
      const link = document.querySelector("#footer > a:nth-child(2)"); // select hypterlink to copy from DOM
      const range = document.createRange();
      range.selectNode(link);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy'); // deprecated but still works
      // navigator.clipboard.writeText(); --> for future use (and should be added to button onclick function)
    };

    // a button is equal to
    let btn = $('<a class="fill buttonToCopy flashBG"> copy</a>');
    // a button's on-click action is
    btn.click(function(){
        // navigator.clipboard.writeText(link)
        onClick()
    });
    // Add the button
    taskName.append(btn)
});

// --------------- END OF COPY BUTTON ----------------------

/**
 * Assign issue to me
 */
$(function assignToMe() {
    // Identify div to add the button to
    let topHorizontalToolbar = buttonLocation

    // a button is equal to
    let btn = $('<a class="fill assignToMe">Assign to me</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_assigned_to_id").val(186);
        $('#issue-form').submit();
    });
    // Add the button
    topHorizontalToolbar.append(btn)
});

/**
 * Button to set status to In progress by TM
 */

$(function statusInProgressTM() {
    // Identify div to add the button to
    let topHorizontalToolbar = buttonLocation

    // a button is equal to
    // let btn = $('<input type="button" value="In progress (LT-TM)">');
    let btn = $('<a class="fill statusInProgressTM">In progress (LT-TM)</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_status_id").val(25);
        $('#issue-form').submit();
    });
    // Add the button
    topHorizontalToolbar.append(btn)
});

/**
 * Button to set status to APP team
 */
$(function statusPendingApp() {
    // Identify div to add the button to
    let topHorizontalToolbar = buttonLocation

    // a button is equal to
    // let btn = $('<input type="button" value="Pending (LT-APP)">');
    let btn = $('<a class="fill PendingApp">Pending (LT-APP)</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_status_id").val(29);
        $('#issue-form').submit();
    });
    // Add the button
    topHorizontalToolbar.append(btn)
});

/**
 * Button to set status to resolved
 */
$(function statusResolved() {
    // Identify div to add the button to
    let topHorizontalToolbar = buttonLocation

    // a button is equal to
    // let btn = $('<input type="button" value="Resolved">');
    let btn = $('<a class="fill Resolved">Resolved</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_status_id").val(3);
        $('#issue-form').submit();
    });
    // Add the button
    topHorizontalToolbar.append(btn)
});

/**
 * Button to set status to Pending MD-OPS
 */
$(function statusPendingMD() {
    // Identify div to add the button to
    let topHorizontalToolbar = buttonLocation

    // a button is equal to
    // let btn = $('<input type="button" value="Pending (MD-OPS)">');
    let btn = $('<a class="fill PendingMd">Pending (MD-OPS)</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_status_id").val(28);
        $('#issue-form').submit();
    });
    // Add the button
    topHorizontalToolbar.append(btn)
});

// Prettify the Edit button
// $("#content > div:nth-child(1) > a.icon.icon-edit").addClass("fill");
// Pretiffy the bottom of the page Edit button
// $("#content > div:nth-child(6) > a.icon.icon-edit").addClass("fill");

// --------------------------- WIKI rework (description area) -------------------------------

GM_addStyle(`
div.wiki {
    /*font-family: 'Roboto', sans-serif;*/
    font-size: 16px;
    border-radius: 10px;
    box-shadow: rgba(6, 24, 44, 0.2) 0px 0px 0px 2px, rgba(6, 24, 44, 0.45) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset !important;
    background-color: white;
    padding-left: 14px !important;
    padding-right: 14px !important;
    padding-top: 5px !important;
    padding-bottom: 8px !important;
    margin-top: 12px !important;
    margin-bottom: 12px !important;
    }

p {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

div.issue {
    background: #FEF5E7;
    border: 1px solid black;
    }

/* Top bar of the whole page that is initially blue */
div#header {
    background-color: gray;
    }
`);

// Edit -> Description ----------------------------

// Always show 'Description' area after pressing the 'Edit' button
$("#issue_description_and_toolbar").show();

$("textarea#issue_description").addClass("descriptionArea fontsize16");



// Wrapping text (sometimes if there's preformatted text in the description,
// it creates a long horizontal scrollbar which is difficult to read.

GM_addStyle(`

.descriptionArea {
    word-wrap: normal !important;
    white-space: pre-wrap !important;
    background-color: #fff !important;
    }

h2 {
    font-size: 18px !important;
}

.fontsize16 {
    font-size: 16px !important;
    height: 400px !important;
}

`);

$("div.wiki pre").addClass("descriptionArea");

// Hide and Unhide attachments ----------------------------
// $("div.attachments").hide();


// ------------------- SUBMIT BUTTON ----------------------

// $("submit").addClass("fill submitButton"); // not working

// ------------------- STICKY NOTE TEXTBOX ----------------

GM_addStyle(`

/* This is the outer part of the Note text box*/
.stickyNotes {
    position: fixed !important;
    bottom: 0 !important;
    right: 20px !important;
    width: 800px !important;
    background: #283747 !important;
    border-radius: 10px !important;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset !important;
    /*font-family: Lato, "Helvetica Neue", Helvetica, sans-serif !important;
    font-size: 16px !important;*/
    }

textarea#issue_notes {
    font-size: 16px !important;
    }

/* Set 'Private notes' text to be white (because it's on black background). */
fieldset.stickyNotes {
    color: #fff !important;
    }

`);

$("#issue-form > div > fieldset:nth-child(3)").addClass("stickyNotes");

// Dealing with Textarea Height
function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  // min-height + lines x line-height
  let newHeight = 40 + numberOfLineBreaks * 19 // Change the first number to adjust the initial height
  if (newHeight > 850) {
      newHeight = 850};
  return newHeight;
}

let textArea = document.querySelector("#issue_notes"); // select the text note inner field

// Initial height
$("#issue_notes").val("\n\n\n\n\n"); // Populate the text area with newlines
$('textarea').prop('selectionEnd', 1); // text-cursor position (2nd line from the top)
textArea.style.height = calcHeight(textArea.value) + "px";

// Constantly recalculating the height
textArea.addEventListener("keyup", () => {
  textArea.style.height = calcHeight(textArea.value) + "px";
});

// Remove the "Notes" title fromm textbox top
document.querySelector("#issue-form > div > fieldset.stickyNotes > legend").remove()

// Add a submit button to the Note area
/**
 * Note submit button
 */
$(function noteSubmit() {
    // Identify div to add the button to
    let noteArea = $(".stickyNotes");

    // a button is equal to
    let btn = $('<input type="submit" name="commit" value="Submit" data-disable-with="Submit">');
    // a button's on-click action is
    btn.click(function(){
        $('#issue-form').submit();
    });
    // Add the button
    noteArea.append(btn)
});

// Add a hide button to the Note area
/**
 * Note hide button
 */
GM_addStyle(`

.stickyButton {
    position: fixed !important;
    bottom: 0 !important;
    }

`);

$(function noteHide() {
    // Initially, the noteHidden value should be false, and the button for showing, shouldn't be visible
    let noteHidden = ""

    // Identify div to add the button to
    let noteArea = $(".stickyNotes");

    // a button is equal to
    let btnHide = $('<input type="button" value="Hide">');
    // a button's on-click action is
    btnHide.click(function(){
        noteHidden = true;
        $("#issue-form > div > fieldset.stickyNotes").hide();
    });
    // Add the button
    noteArea.append(btnHide)

    if (noteHidden == true) {
        let minimizedBtn = $('<input type="button" class="stickyButton" value="Show note">');
        // a button's on-click action is
        minimizedBtn.click(function(){
            noteHidden = false;
            $("#issue-form > div > fieldset.stickyNotes").show();
        });
        // Add the button
        $("div#footer").append(minimizedBtn)
    };
});


// ------------------- Post-release -> Skip both ----------------


$(function setPostReleaseFieldsToSkip() {
    // Identify div to add the button to
    // let div = document.querySelector("#content > div.issue.tracker-4.status-5.priority-2.priority-high4.closed.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_118.attribute")
    let div = $("#content > h2");

    // a button is equal to
    // let btn = $('<input type="button" value="Resolved">');
    // let btn = $('<input type="button" class="fill Resolved" value="Skip both">');
    let btn = $('<a class="fill Resolved">Skip both</a>');
    // a button's on-click action is
    btn.click(function(){
        $("#issue_custom_field_values_122").val("Skip");
        $("#issue_custom_field_values_123").val("Skip");
        $('#issue-form').submit();
    });
    // Add the button
    div.append(btn)
});


// -------------------------- Keyboard shortcut for Edit and Submit (alt + q and alt + w) ---------------

try {
    document.querySelector("#content > div:nth-child(6) > a.icon.icon-edit").accessKey = "q"; // Edit task when shortcut Alt + q is pressed
    document.querySelector("#issue-form > input[type=submit]:nth-child(7)").accessKey = "w"; // Save task when shortcut Alt + w is pressed
} catch(e) {
    console.log(e)
};

// -------------------------- Highlight fields of interest ----------------------------------------------
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

// @test
// document.querySelector("#content > div.issue.tracker-1.status-2.priority-4.priority-high2.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_26.attribute > div.value").classList.add("fieldOfInterest") // working


function highlight(jsPath, highlightFieldList) {
    let field = document.querySelector(jsPath).innerText;
    if (highlightFieldList.includes(field)) {
        field.addClass('fieldOfInterest');
    };
};

// Highlight MR status
// highlight("#content > div.issue.tracker-1.status-2.priority-4.priority-high2.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_26.attribute > div.value", ['NONE']);

// Highlight 'Internal improvement'
/*
highlight(
    "#content > div.issue.tracker-4.status-1.priority-4.priority-high2.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_122.attribute > div.value",
    ['']
);
*/

// https://stackoverflow.com/questions/25487402/javascript-select-nested-class-element/25487543




