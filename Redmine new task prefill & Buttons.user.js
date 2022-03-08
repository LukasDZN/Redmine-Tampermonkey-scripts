// ==UserScript==
// @name         Redmine new task prefill & Buttons
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        redmine.tribepayments.com/projects/isac-iss/issues/new
// @require      https://code.jquery.com/jquery-3.6.0.js
// ==/UserScript==

var $ = window.jQuery;

$(function(){
    $('#issue_status_id').val('11'); // Not approved 11 new 1
    $('#issue_parent_issue_id').val('22951'); // parent task
    $('#issue_custom_field_values_18').attr('checked',true); // reports - planned
    //$("input[name='issue[custom_field_values][2][]']").eq(2).attr('checked',true); // Application: 0 - UPC, 2 - ISAC
    $('#issue_tracker_id').val('4'); // BUG 1, TASK 4
    $('#issue_estimated_hours').val(4); // issue_estimated_hours
    $('#issue_priority_id').val('3'); // Priority 2 normal 4 urgent 5 immediate
    $('#issue_custom_field_values_3').val('Developers'); // For
    $('#issue_custom_field_values_5').val('Lukas Dzenkauskas'); // Reported by
    $('#issue_custom_field_values_6').val('Justas Turonis'); // Responsible
    //$('#issue_assigned_to_id').val('67'); // E.g. assignee 67 - Aidas Ramoska
    $('#issue_custom_field_values_32').val('Done'); // Review status
    $('#issue_subject').val('ISAC-IS-CORE: ');
    $('#issue_description').val("h2. Where to find: \n\n\n\nh2. How to reproduce:\n\n\n\nh2. Expected results (acceptance criteria: given conditions -> expected results):\n\n\n\n"); // Description template
    $('#issue_description').height("280px"); // description box size
});

// jquery selectors: https://www.w3schools.com/Jquery/jquery_ref_selectors.asp

//-------------------------------------------------------------------------------
// Reports - tag

$(function(){
    'use strict';

    // Prepare list
    const tags = {
        isac: [
            'ISAC-ISS: ',
            'ISAC-ISS: Bugfixes / improvements',
            'ISAC-ISS: Tribe Hub GUI UI / UX enhancements (Stage 1)',
            'ISAC-ISS: VISA VTS',
            'ISAC-DOCS: ',
        ]
    };
    const customTags = tags[window.location.pathname.split('/')[2]] || [];

    // div field
    let reports_tag_p = $("#attributes > div:nth-child(2) > div.splitcontentleft > p:nth-child(8)") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path

    // Reports tag text field
    let tagField = $("#issue_custom_field_values_16")
    // Base value
    tagField.val('ISAC-ISS: ');

    // For each tag
    $.each( customTags, function( key, tag ) {
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
    const tags = {
        isac: [
            'eToro-p0',
            'eToro-p1',
            'eToro-p2',
            'eToro-p3',
            'Hotfix',
            'goLiveBlocker',
        ]
    };
    const customTags = tags[window.location.pathname.split('/')[2]] || [];

    // div field
    let reports_tag_p = $("#attributes > div:nth-child(2) > div.splitcontentleft > p:nth-child(9)") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path

    // Reports tag text field
    let tagField = $("#issue_custom_field_values_33")

    // For each tag
    $.each( customTags, function( key, tag ) {
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

    const tagg = {
        "[TG] ISAC - Issuer": "22951",
        "[TG] Tribe Hub GUI UI / UX": "41967"
    };

    // Add a div field below the field needed to fill
    let reports_tag_p = $("#parent_issue") // $ is same as document.querySelector('#...') but it creates a jquery object instead | Copy JS path

    // Reports tag text field
    let tagField = $("#issue_parent_issue_id")
    // Base value
    tagField.val('22951');
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
// GUI enchancements

// Create button CSS style (source: https://www.fabriziovanmarciano.com/button-styles/)
// $("#issue-form > input[type=submit]:nth-child(4)").css({"background":"black","color":"white", "height":"50px", "width":"180px", "border-radius":"10px", "border":"0px solid #4CAF50", "font-size":"18px", "font-weight": "bold", "margin":"20px 0px"});
$("#issue-form > input[type=submit]:nth-child(4)").css({"height":"50px", "width":"180px", "font-size":"18px"}); // Increase button size
// Remove Create and add another button (because it's never used)
$("#issue-form > input[type=submit]:nth-child(5)").remove()
// Remove footer
$("#footer").remove()



