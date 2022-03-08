// ==UserScript==
// @name         Redmine copy task prefills
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        redmine.tribepayments.com/projects/*/issues/*/copy
// @require      https://code.jquery.com/jquery-3.6.0.js
// ==/UserScript==


var $ = window.jQuery;

$(function(){

    //-------------------------------------------------------------------------------
    // Change fields

    $('#issue_status_id').val('11'); // Not approved 11 new 1
    //$('#issue_parent_issue_id').val('22951'); // parent task
    $('#issue_custom_field_values_18').attr('checked',true); // reports - planned
    //$("input[name='issue[custom_field_values][2][]']").eq(2).attr('checked',true); // Appication: 0 - UPC, 2 - ISAC
    //$('#issue_tracker_id').val('4'); // BUG 1, TASK 4
    //$('#issue_estimated_hours').val(4); // issue_estimated_hours
    $('#issue_priority_id').val('3'); // Priority 2 normal 4 urgent 5 immediate
    $('#issue_custom_field_values_3').val('Developers'); // For
    $('#issue_custom_field_values_5').val('Lukas Dzenkauskas'); // Reported by
    $('#issue_custom_field_values_6').val('Justas Turonis'); // Responsible
    //$('#issue_assigned_to_id').val('67'); // E.g. assignee 67 - Aidas Ramoska
    $('#issue_custom_field_values_32').val('Done'); // Review status
    //$('#issue_subject').val('ISAC-IS-CORE: ');
    //$('#issue_description').val("h2. Where to find: \n\n\n\nh2. Result received:\n\n\n\nh2. Result expected:\n\n\n\n"); // Description template
    $('#issue_description').height("220px"); // description box size

    //-------------------------------------------------------------------------------
    // Clear fields

    $("#copy_attachments").attr('checked',false); // copy attachements -> no
    $("#issue_custom_field_values_43").val(""); // resolved at

    $("#issue_custom_field_values_9").val(""); // clear deployed to pre field
    $("#issue_custom_field_values_10").val(""); // clear deployed to sandbox field
    $("#issue_custom_field_values_11").val(""); // clear deployed to live field

    $("#issue_start_date").val(""); // start date
    $("#issue_due_date").val(""); // due date

    $("#issue_fixed_version_id").val("1"); // sprint version
    $("#issue_done_ratio").val("1"); // done %

    $("#issue_custom_field_values_14").val("") // deployment notes
    $("#issue_custom_field_values_12").val("") // git branch
    $("#issue_custom_field_values_23").val("") // deployment tag
    $("#issue_custom_field_values_25").val("") // MR
    $("#issue_custom_field_values_26").val("") // MR status
    $("#issue_custom_field_values_99").val("") // feedback count

    $("#issue_custom_field_values_4").val("") // test status
    $("#issue_custom_field_values_8").val("") // test by
    $("#issue_custom_field_values_22").val("") // test date
    $("#issue_custom_field_values_37").val("") // test tag

    //-------------------------------------------------------------------------------
    // Remaining unchanged fields
    /*
        - Tracker
        - Subject
        - Description
        - Assignee
        - Estimated time
        - Report tag
    */

});

//-------------------------------------------------------------------------------
// GUI enchancements

// Create button CSS style (source: https://www.fabriziovanmarciano.com/button-styles/)
$("#issue-form > input[type=submit]:nth-child(5)").css({"background":"black","color":"white", "height":"50px", "width":"180px", "border-radius":"10px", "border":"0px solid #4CAF50", "font-size":"18px", "font-weight": "bold", "margin":"20px 0px"});
// Remove Create and add another button (because it's never used)
$("#issue-form > input[type=submit]:nth-child(6)").remove()
// Remove footer
$("#footer").remove()



