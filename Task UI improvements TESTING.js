// ==UserScript==
// @name         Task UI improvements TESTING ENVIRONMENT
// @version      0.4
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
// @require      https://cdn.quilljs.com/1.3.6/quill.snow.css
// @require      https://cdn.quilljs.com/1.3.6/quill.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

// Pending Implementation button

// 36 Pending (MD-IMPL)

// --- User guide ----------------------------------------------------------------

// * Customization: You can enable/disable or customize certain features by changing the variable constants in the config category below this one.
// * New keyboard shortcuts: Tasks can be edited by pressing 'alt + q' and submited by pressing 'alt + w'
// * Unsubmitted notes will now be saved automatically

// --- User-specific config ------------------------------------------------------

// Choose your role type, in order for the script to display the appropriate Support ticket status buttons
var userRole = "PM"; // Possible values: 'PM', 'OPS', 'BOTH'. Default value: 'OPS'.

// Custom note field that sticks to the right side of the screen
var enableCustomNoteEntryField = true; // Enable/disable by putting in either 'true' or 'false'

// Task details page UI design
var enableCustomTaskPageDesign = true; // Enable/disable by putting in either 'true' or 'false'
// If the above "Task details page" is enabled, you can choose custom CSS colours (https://htmlcolorcodes.com/) for:
// Header
var headerColorCss = ``; // Possible value example:  "background-color:'#808080';"  or any gradient from here: https://cssgradient.io/ or https://uigradients.com/
// Task details
var taskDetailsColor = "#FEF5E7";
// Task details width (possible option for 70)
var contentWidthPercent = 50;

// --- Imports -------------------------------------------------------------------

var $ = window.jQuery;

document.onreadystatechange = function () {
  // Possible values: 'loading', 'interactive', 'complete'
  if (document.readyState === "interactive") {
    // --- Detect project ------------------------------------------------------------

    // Make sure that parsed keywords in the main text title are avoided.
    let taskTitle = $("head > title").text().slice(-28);

    if (taskTitle.includes("Support - ")) {
      var taskType = "Support";
    } else {
      var taskType = "Development";
    }

    // User ID
    var myUserLink = $("#loggedas a").attr("href");
    var myID = myUserLink.match(/(\d*)$/i)[0];

    //-------------------------- REMOVING UI ELEMENTS --------------------------------

    let removeClassesList = [
      ".icon-time-add",
      ".icon-comment",
      ".next-prev-links",
      "#content > p",
    ];
    removeClassesList.forEach((className) =>
      document.querySelectorAll(className).forEach((e) => e.remove())
    );

    document
      .querySelectorAll("#add_to_important_list")
      .forEach((e) => e.remove());

    // Remove ' |' before Edit

    GM_addStyle(`
        .contextual {
            color: white;
        }
        `);

    // --------------- SEARCH BAR LENGTHENING ----------------------------------------

    GM_addStyle(`
        .searchLength {
            width: 50vw !important;
        }
        `);

    $("#q").addClass("searchLength");

    // ---------------------------- Note taking field -------------------------------
    // @new
    document.querySelector("#sidebar").remove();

    GM_addStyle(`
        .noteArea {
            width: 30vw !important;
            background: red;
            padding: 10px;
            margin: 10px;
        }
        `);

    // document.querySelector("#main").classList.add('');
    // let noteTakingArea = document.querySelector("#main");
    // let newElement = document.querySelector("<textarea class='noteArea' />");

    // document.querySelector('#main').innerHTML = '<textarea class="noteArea" />';
    // let newElement = document.createElement("<textarea class='noteArea' />");
    // noteTakingArea.append(newElement);

    // --- JQUERY

    // $("#main").append(`<textarea class="noteArea" />`)

    // --- Library

    GM_addStyle(`
        #editor-container {
          height: 375px;
        }
        `);

    // $("#head").append(`<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>`)
    // $("#head").append(`<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>`);
    // $("#head").append(`<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">`);

    var quill = new Quill("#editor-container", {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
      placeholder: "Compose an epic...",
      theme: "snow", // or 'bubble'
    });

    // $("#main").append(`<textarea class="noteArea" />`)
    $("#main").append("#editor-container");

    // ---------------------------- BUTTONS -----------------------------------------

    // All button location (top bar)
    let buttonLocation = $("#content > h2");

    GM_addStyle(`
        /* optional - add  "input[type="submit"]' as a selector below in order to style the submit button */
        .fill, input[type="submit"]{
            font-family: "Inter", sans-serif!important;
            font-size: 12px;
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
            min-width: 60px;
            padding: 8px 4px;
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

        /* Roles: BOTH, PM, OPS */
        .assignToMe {
            background-color: #D5F5E3;
        }

        /* Roles: PM */
        .inProgressPm {
            background-color: #F9E79F;
        }
        .pendingOps {
            background-color: #DCF5A8;
        }
        .pendingApp {
            background-color: #EDBB99;
        }
        .pendingDevops {
            background-color: #AEB6BF;
        }
        .pendingInfra {
            background-color: #D4E6F1;
        }
        .resolved {
            background-color: #85C1E9;
        }

        /* Roles: Ops */
        .new {
            background-color: #6DFF95;
        }
        .inProgressOps {
            background-color: #F9E79F;
        }
        .pendingPm {
            background-color: #EDBB99;
        }
        .feedback {
            background-color: #FF9388;
        }
        .closed {
            background-color: #BBBBBB;
        }

        /* Edit button */
        a.icon.icon-edit.fill {
            background-color: #4D75B2;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 20px;
            padding-right: 20px;
            color: white;
        }

        /* Submit button */
        input[type="submit"] {
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            background-color: #05DCA2;
            padding-top: 8px;
            padding-bottom: 12px;
            padding-left: 20px;
            padding-right: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-left: 10px;
            margin-right: 10px;
            min-width: 70px;
            min-height: 30px;
            color: white;
        }

        input[type="submit"]:hover {
            background-color: #05DCA2;
            text-decoration: none;
            box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
        `);

    // --------------------------- COPY feature next to task title --------------------------

    GM_addStyle(`

        .buttonToCopy {
            background-color: #F5F5F5 !important;
        }

        .flashBG {
            margin-right: 16px !important;
            margin-left: 8px !important;
        }

        `);

    /**
     * Button to copy task hyperlink to clipboard
     */

    function copyButton() {
      // Identify div to add the button to
      let taskName = $("#content > h2");

      // Preparing content to write to clipboard
      let pageUrl = window.location.href;
      let taskTitle = $("head > title").text().slice(0, -17); // Turn header element into text, then remove " - TribePayments" part of the string
      // Remove the " - <Project name>" from the end of the string
      let cleanedStringEndingIndex = taskTitle.lastIndexOf(" - ");
      let cleanedTaskTitle = taskTitle.substring(0, cleanedStringEndingIndex);

      // Create a hyperlink
      $("#footer").append(
        `<a href="${pageUrl}" style="color: white">${cleanedTaskTitle}</a>`
      );

      // This is a working solution that copies a hyperlink | Source: https://stackoverflow.com/questions/53003980/how-to-copy-a-hypertext-link-into-clipboard-with-javascript-and-preserve-its-lin
      const onClick = (evt) => {
        const link = document.querySelector("#footer > a:nth-child(2)"); // select hypterlink to copy from DOM
        const range = document.createRange();
        range.selectNode(link);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand("copy"); // deprecated but still works
        // navigator.clipboard.writeText(); --> for future use (and should be added to button onclick function)
      };

      // a button is equal to
      let btn = $('<a class="fill buttonToCopy flashBG"> copy link</a>');
      // a button's on-click action is
      btn.click(function () {
        // navigator.clipboard.writeText(link)
        onClick();
      });
      // Add the button
      taskName.append(btn);
    }

    copyButton();

    // --------------- All buttons ----------------------

    if (taskType == "Support") {
      // Universal status button function
      function addStatusButton(statusClassName, buttonText, statusId) {
        // Identify div to add the button to
        let topHorizontalToolbar = buttonLocation;
        // a button is equal to
        let btn = $(`<a class="fill ${statusClassName}">${buttonText}</a>`);
        // a button's on-click action is
        btn.click(function () {
          $("#issue_status_id").val(statusId);
          $("#issue-form").submit();
        });
        // Add the button
        topHorizontalToolbar.append(btn);
      }

      /**
       * Assign issue to me
       */
      function assignToMe(userRole) {
        // Identify div to add the button to
        let topHorizontalToolbar = buttonLocation;
        // a button is equal to
        let btn = $('<a class="fill assignToMe">Assign to me</a>');
        // a button's on-click action is

        if (userRole == "PM" || userRole == "BOTH") {
          btn.click(function () {
            $("#issue_assigned_to_id").val(myID);
            $("#issue-form").submit();
          });
          // Add the button
          topHorizontalToolbar.append(btn);
        } else if (userRole == "OPS" || userRole == "BOTH") {
          // Currently there's no way to assign Ops assignee as 'Me'
          // btn.click(function(){
          //     $("#issue_assigned_to_id").val(<id>);
          // }
          // Add the button
          // topHorizontalToolbar.append(btn)
        }
      }

      // Create an Assign to me button for BOTH and PM roles
      assignToMe(userRole);

      // Adding buttons for specified user roles
      if (userRole == "PM" || userRole == "BOTH") {
        addStatusButton("inProgressPm", "In progress (LT-PM)", 25);
        addStatusButton("pendingOps", "Pending (LT-OPS)", 28);
        addStatusButton("pendingApp", "Pending (LT-APP)", 29);
        addStatusButton("pendingDevops", "Pending (DevOps)", 34);
        addStatusButton("pendingInfra", "Pending (Infra)", 32);
        addStatusButton("resolved", "Resolved", 3);
      }
      if (userRole == "OPS" || userRole == "BOTH") {
        addStatusButton("new", "New", 1);
        addStatusButton("inProgressOps", "In progress (LT-OPS)", 27);
        addStatusButton("pendingPm", "Pending (LT-PM)", 30);
        addStatusButton("feedback", "Feedback", 4);
        addStatusButton("closed", "Closed", 5);
      }
    }

    // ------------------- Post-release -> Skip both ----------------
    // Displayed on "Development" tasks only

    if ((taskType == "Development" && userRole == "PM") || userRole == "BOTH") {
      $(function setPostReleaseFieldsToSkip() {
        // Identify div to add the button to
        // let div = document.querySelector("#content > div.issue.tracker-4.status-5.priority-2.priority-high4.closed.child.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_118.attribute")
        let div = $("#content > h2");

        // a button is equal to
        // let btn = $('<input type="button" value="Resolved">');
        // let btn = $('<input type="button" class="fill Resolved" value="Skip both">');
        let btn = $('<a class="fill Resolved">Skip both</a>');
        // a button's on-click action is
        btn.click(function () {
          $("#issue_custom_field_values_122").val("Skip");
          $("#issue_custom_field_values_123").val("Skip");
          $("#issue-form").submit();
        });
        // Add the button
        div.append(btn);
      });
    }

    // Prettify the Edit button
    try {
      $("#content > div:nth-child(1) > a.icon.icon-edit").addClass("fill");
    } catch (error) {
      console.log("Couldn't prettify the Edit button");
    }

    // Pretiffy the bottom of the page Edit button
    try {
      $("#content > div:nth-child(6) > a.icon.icon-edit").addClass("fill");
    } catch (error) {
      console.log("Couldn't prettify the Edit button");
    }

    // --------------------------- Task details page rework (description, notes, etc.) -------------------------------

    $(
      "#content > div.issue.tracker-19.status-5.priority-3.priority-high3.closed.created-by-me.details > div.attributes > div:nth-child(2) > div:nth-child(2) > div.cf_25.attribute > div.value > div"
    ).addClass("mrDiv");

    if (enableCustomTaskPageDesign == true) {
      GM_addStyle(`
            div.wiki {
                /*font-family: 'Roboto', sans-serif;*/
                font-size: 15px;
                border-radius: 10px;
                box-shadow: rgba(6, 24, 44, 0.2) 0px 0px 0px 2px, rgba(6, 24, 44, 0.45) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset !important;
                background-color: white;
                padding-left: 14px !important;
                padding-right: 14px !important;
                padding-top: 8px !important;
                padding-bottom: 8px !important;
                margin-top: 12px !important;
                margin-bottom: 12px !important;
                margin-left: 6px !important;
                margin-right: 6px !important;
            }

            /* MR div */
            div.cf_25.attribute > div.value > div {
                box-shadow: unset !important;
                background-color: ${taskDetailsColor};
            }

            /* Page Global CSS */
            .tab-content {
                border: none !important;
            }

            #footer {
                border-top: none !important;
                color: white !important;
            }

            #footer > a {
                color: white !important;
            }

            /*
            input {
                font-family: Inter, "Helvetica Neue", Helvetica, sans-serif;
                background-color: #80cc74;
            }
            */

            p {
                margin-top: 10px !important;
                margin-bottom: 10px !important;
            }

            #content {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
                max-width: ${contentWidthPercent}vw !important;
            }

            div.issue {
                background: ${taskDetailsColor};
                /* border: 1px solid black; */
            }

            /* Top bar of the whole page that is initially blue */
            div#header {
                ${headerColorCss};
            }

            `);

      // --------- Edit -> Description ----------------------------

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
    }

    // ------------------- STICKY NOTE TEXTBOX ----------------

    if (enableCustomNoteEntryField == true) {
      GM_addStyle(`

            /* This is the outer part of the Note text box*/
            .stickyNotes {
                position: fixed !important;
                bottom: 0 !important;
                right: 20px !important;
                min-width: 800px !important;
                max-width: 1600px !important;
                width: 40vw !important;
                background: #283747 !important;
                border-radius: 10px !important;
                box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset !important;
            }

            textarea#issue_notes {
                font-size: 1.3em;
                font-family: Inter, "Helvetica Neue", Helvetica, sans-serif !important;
            }

            /* Set 'Private notes' text to be white (because it's on black background). */
            fieldset.stickyNotes {
                color: #fff !important;
            }

            `);

      GM_addStyle(`

            .showButton {
                position: fixed;
                bottom: 0;
                background-color: #283747;
                color: white;
                border-radius: 10px;
                min-width: 100px;
                min-height: 30px;
                font-family: Inter, "Helvetica Neue", Helvetica, sans-serif;
            }

            .showButton:hover {
                background-color: #283747;
                box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
            }

            `);

      // --- Add Note text area --------------------------------------------------------
      $("#issue-form > div > fieldset:nth-child(3)").addClass("stickyNotes");

      // Dealing with Textarea Height
      function calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height
        let newHeight = numberOfLineBreaks * 20; // Change the first number to adjust the initial height
        if (newHeight > 850) {
          newHeight = 850;
        }
        if (newHeight < 200) {
          newHeight = 200;
        }
        return newHeight;
      }

      let textArea = document.querySelector("#issue_notes"); // select the text note inner field

      // Initial height
      $("#issue_notes").val("\n\n\n\n\n\n"); // Populate the text area with newlines
      $("textarea").prop("selectionEnd", 1); // text-cursor position (2nd line from the top)
      textArea.style.height = calcHeight(textArea.value) + "px";

      // Constantly recalculating the height & Saving the textarea value to local storage
      textArea.addEventListener("keyup", () => {
        textArea.style.height = calcHeight(textArea.value) + "px";
        saveNoteToLocalStorage();
      });

      // Remove the "Notes" title from textbox top
      document
        .querySelector("#issue-form > div > fieldset.stickyNotes > legend")
        .remove();

      // --- Add a submit button to the Note area ---------------------------------------
      /**
       * Note submit button
       */
      $(function noteSubmit() {
        // Identify div to add the button to
        let noteArea = $(".stickyNotes");

        // a button is equal to
        let btn = $(
          '<input type="submit" name="commit" value="Submit" data-disable-with="Submit">'
        );
        // a button's on-click action is
        btn.click(function () {
          clearNoteFromLocalStorage();
          $("#issue-form").submit();
        });
        // Add the button
        noteArea.append(btn);
      });

      // --- Save note content to Local Storage ------------------------------------------

      var RedmineTaskNumber = window.location.href
        .split("/issues/")[1]
        .substring(0, 5);

      // Set Item
      /* localStorage.setItem(key, value); */
      function saveNoteToLocalStorage() {
        localStorage.setItem(
          RedmineTaskNumber,
          document.querySelector("#issue_notes").value
        );
      }

      // Retrieve
      /* let lastname = localStorage.getItem(key); */
      // On-load --> set the textarea to the last saved value
      document.querySelector("#issue_notes").value =
        localStorage.getItem(RedmineTaskNumber);

      // Local storage for this particular page is cleared upon clicking "Submit"
      function clearNoteFromLocalStorage() {
        localStorage.removeItem(RedmineTaskNumber);
      }

      // Add the clearNoteFromLocalStorage function to the submit buttons
      try {
        document
          .querySelector("#issue-form > input[type=submit]:nth-child(7)")
          .addEventListener("click", function () {
            clearNoteFromLocalStorage();
          }); // Clear local storage when clicking "Submit" }
      } catch (e) {
        document
          .querySelector("#issue-form > input[type=submit]:nth-child(7)")
          .addEventListener("click", function () {
            clearNoteFromLocalStorage();
          }); // Clear local storage when clicking "Submit"}
      }

      // --- Add a hide button to the Note area ------------------------------------------
      /**
       * Note hide button
       */

      GM_addStyle(`

            .hideButton {
                margin-left: 5px !important;
            }

            `);

      $(function noteHide() {
        // Identify div to add the button to
        let noteArea = $(".stickyNotes");

        // a button is equal to
        let btnHide = $(
          '<input type="button" class="hideButton" value="Hide">'
        );

        // "Hide" button's onClick action
        btnHide.click(function () {
          // onClick -> Hide the text area
          $("#issue-form > div > fieldset.stickyNotes").hide();
          $("#footer > input:nth-child(5)").hide();

          // Add "Show note" button
          $(function unhideNote() {
            let minimizedBtn = $(
              '<input type="button" class="showButton Resolved" value="Show note">'
            );
            // a button's on-click action is
            minimizedBtn.click(function () {
              $("#issue-form > div > fieldset.stickyNotes").show();
              $("#footer > input").hide();
            });

            // Add the button
            $("div#footer").append(minimizedBtn);
          });
        });

        // Add the button
        noteArea.append(btnHide);
      });
    }

    // ------------------------------------------------------------
    // --- All pages ----------------------------------------------
    // ------------------------------------------------------------

    // -------------------------- Keyboard shortcut for Edit and Submit (alt + q and alt + w) ---------------

    try {
      document.querySelector(
        "#content > div:nth-child(6) > a.icon.icon-edit"
      ).accessKey = "q"; // Edit task when shortcut Alt + q is pressed
      document.querySelector(
        "#issue-form > input[type=submit]:nth-child(7)"
      ).accessKey = "w"; // Save task when shortcut Alt + w is pressed
    } catch (e) {
      console.log("First block: " + e);

      try {
        document.querySelector(
          "#content > div:nth-child(2) > a.icon.icon-edit"
        ).accessKey = "q"; // Edit task when shortcut Alt + q is pressed (when "Successful update." is displayed)
        document.querySelector(
          "#issue-form > input[type=submit]:nth-child(7)"
        ).accessKey = "w"; // Save task when shortcut Alt + w is pressed
      } catch (e) {
        console.log("Second block: " + e);
      }
    }

    // --- Potential features ------------------------------------------------------------------------------

    // - Add a search feature to the fields when editing a task [assignee, reported by, ]

    /*
        Input would be an Object = {
            "conditions": ["AND", "OR", "NOT"],
            "assignee": ["me", "John Doe"],




        */

    // function addSearch() {
    //     let allMultiSelects = $('.list_cf.check_box_group');
    //     allMultiSelects.each(function (i, el) {
    //         let multiselect = $(el);
    //         var customSearch = $("<input>", {"type": "text", "class": "custom-search-input", "placeholder": "Search...", "style": "width: 100%; max-width: 100%;"});
    //         multiselect.prepend(customSearch);
    //         customSearch.val(activeSearch);
    //         filterProjects(multiselect, activeSearch);

    //         customSearch.on('input', function (e) {
    //             let searchText = $(e.target).val();
    //             if (searchText === '') {
    //                 showAllProjects(multiselect);
    //             } else {
    //                 filterProjects(multiselect, searchText);
    //             }
    //         });
    //     });
    // }

    // $("#issue_custom_field_values_39").addClass("custom-search-input");

    // - Create rules for highlighting fields [WIP below]

    /*
        Copy --> Copy URL
        Assign to me --> neveikia - paskiria Laura
        buttonai --> laura skiria tik individualiems devams (dropdowna tam paciam div'e padaryt kad eitu pasirinkt) - bet kai pirma kart paskiri tai poto jau nebereik paskirt, kai 10 kart statusas eina back and forth.

        - Custom queries --> padaryt kad eitu pasirinkt pagal hyperlink title kuriuos displayint. Pvz laura nori isfiltruot kad rodytu tik TM-ISAC-ACQ: * <- wildcard, bei kad nerodytu, "TM-ISAC-ACQ: My requests"
        - Kur vienas komentaras atrodo keistai, bet kur daug komentaru ten px. --> paklaust del dizaino? --> paieskot pavyzdziu

        By default, update --> checkmarkas nuimtas.

        status highlightinima galima pridet (bendrai tekste).



        note'as --> neissisaugo foto jeigu

        Galimai fontas per didelis - gal pamazint -> padaryt configurable?
        */

    // --- Non-important features ---

    // - [DONE] Save Note field to local storage, so that when you come back to a page - it is saved.

    // --- Bugs ---

    // - [DONE] "Show note" button is displayed over "Hide" button on larger screens.

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
        field.addClass("fieldOfInterest");
      }
    }

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
  }
};
