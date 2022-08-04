// ==UserScript==
// @name         Redmine edit task buttons
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        redmine.tribepayments.com/issues/4*
// @match        redmine.tribepayments.com/issues/5*
// @match        redmine.tribepayments.com/issues/6*
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL  https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/Redmine%20edit%20task%20buttons.user.js
// @updateURL    https://github.com/LukasDZN/Redmine-Tampermonkey-scripts/raw/main/Redmine%20edit%20task%20buttons.user.js
// ==/UserScript==


var $ = window.jQuery;

//-------------------------------------------------------------------------------
// Reports - tag

$(function(){
    'use strict';

    // Prepare list
    const tags = [
            'ISAC-ISS: ',
            'ISAC-ISS: Bugfixes / improvements',
            'ISAC-ISS: Tribe Hub GUI UI / UX enhancements (Stage 1)',
            'ISAC-ISS: Write tests',
        ];

    // div field
    let reports_tag_p = $("#attributes > div:nth-child(2) > div.splitcontentleft > p:nth-child(8)") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path
    // let reports_tag_p = $("#issue_custom_field_values_16")

    // Reports tag text field
    let tagField = $("#issue_custom_field_values_16")

    // For each tag
    $.each( tags, function( key, tag ) {
        // a button is equal to
        let btn = $('<input type="button" value="'+tag+'">');
        // a button's on-click action is
        btn.click(function(){
            tagField.val($(this).val());
        });
        reports_tag_p.append(btn);
    });
});

//-------------------------------------------------------------------------------
// Follow-up tag

$(function(){
    'use strict';

    // Prepare list
    const tags = [
        'groomed',
        'internal-improvement',
        'to-groom-next'
    ];

    // div field
    let reports_tag_p = $("#attributes > div:nth-child(2) > div.splitcontentleft > p:nth-child(9)") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path

    // Reports tag text field
    let tagField = $("#issue_custom_field_values_33")

    // For each tag
    $.each( tags, function( key, tag ) {
        // a button is equal to
        let btn = $('<input type="button" value="'+tag+'">');
        // a button's on-click action is
        btn.click(function(){
            tagField.val($(this).val());
        });
        reports_tag_p.append(btn);
    });
});

//-------------------------------------------------------------------------------
// Parent task

$(function(){
    'use strict';

    // Prepare list
    const tagg = {
        "[TG] ISAC - Issuer": "22951",
        "[TG] Tribe Hub GUI UI / UX": "41967"
    };

    // Add a div field below the field needed to fill
    let reports_tag_p = $("#parent_issue") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path

    // Reports tag text field
    let tagField = $("#issue_parent_issue_id")
    // Base value
    // tagField.val('22951');
    // Add new line
    tagField.append('\n')

    for (let tagName in tagg) {
        // a button is equal to
        let btn = $('<input type="button" value="'+tagName+'">');
        // a button's on-click action is
        btn.click(function(){
            tagField.val(tagg[tagName]);
        });
        reports_tag_p.append(btn);
    }
});

//-------------------------------------------------------------------------------

/**
 * Add a visible note form field at the bottom of the page.
 */
/**
$(function addNoteForm() {
    // Clone the existing note field (from the description div)
    let noteForm = $("#issue-form > div > fieldset:nth-child(3)").clone();
    // Append the field to the bottom of the main 'content' div
    noteForm.appendTo("#content");

    // a button is equal to
    let btn = $("#issue-form > input[type=submit]:nth-child(7)").clone();
    // a button's on-click action is
    btn.click(function(){
        $("#content > fieldset").submit(); // Issue that the form is not submitted. Possibly only the fields in the original Edit div field are submitted.
    });
    // Add the button
    noteForm.append(btn)
});*/


/**
 * Add a visible note form field at the bottom of the page. ## Attempt 2 -> by copying the whole edit element instead of just the note field.
 */
/**

$(function addNoteForm() {
    // Clone the existing 'Edit' form
    let noteForm = $("#issue-form").clone();
    // Set main content (which is the content to which the form will be appended to)
    let mainContent = $("#content > p")
    // Append the form
    mainContent.after(noteForm)
    // Remove everything but the note form field
    $("#issue-form > div > fieldset:nth-child(1)").remove()
    $("#issue-form > div > fieldset.tabular").remove()

    /**
    // a button is equal to
    let btn = $('<input type="submit" name="commit" value="Submit" data-disable-with="Submit">');
    // a button's on-click action is
    btn.click(function(){
       $("#issue-form").submit(); // Issue that the form is not submitted. Possibly only the fields in the original Edit div field are submitted.
    });
    // Add the button
    noteForm.append(btn)

});
*/


/**
    Quill editor
*/

/**
$(function addNoteForm() {
    // Clone the existing 'Edit' form
    let noteForm = $("#issue-form").clone();
    // Set main content (which is the content to which the form will be appended to)
    let mainContent = $("#content > p")
    // Append the form
    mainContent.after(noteForm)
    // Remove everything but the note form field
    $("#issue-form > div > fieldset:nth-child(1)").remove()
    $("#issue-form > div > fieldset.tabular").remove()

    /**
    // a button is equal to
    let btn = $('<input type="submit" name="commit" value="Submit" data-disable-with="Submit">');
    // a button's on-click action is
    btn.click(function(){
       $("#issue-form").submit(); // Issue that the form is not submitted. Possibly only the fields in the original Edit div field are submitted.
    });
    // Add the button
    noteForm.append(btn)
});*/


/*
<!-- Main Quill library -->
<script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>

<!-- Theme included stylesheets -->
<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">

<!-- Core build with no theme, formatting, non-essential modules -->
<link href="//cdn.quilljs.com/1.3.6/quill.core.css" rel="stylesheet">
<script src="//cdn.quilljs.com/1.3.6/quill.core.js"></script>


https://quilljs.com/docs/configuration/
**/

/*
Redmine designs:
https://www.redmine.org/projects/redmine/wiki/theme_list
*/


// Hide element with js -> perhaps I can hide part of the 'edit' div so that only the note remains
// https://stackoverflow.com/questions/6242976/javascript-hide-show-element