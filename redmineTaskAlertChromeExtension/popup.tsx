// --- Notes ------------------------------------------------------------------------

// chrome://extensions/ --> turn on developer mode and choose "load unpacked"
// then locate the folder of your extension

// chrome://extensions

// 128 x 128 --> should be called icon_128.png
// 19 x 19 --> toolbar icon, that should be called icon.png
// Image resizer: http://www.simpleimageresizer.com/upload

// https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#modifying-network-requests

// Google sheets - Append row API documentation
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append

// alert('hi')

// -- Misc learning ---------------------------------------------------------------

// The difference between querySelector() and querySelectorAll() is that querySelector() returns a single object with the first HTML element that matches the 'selectors', but querySelectorAll() returns an array of objects with all the HTML elements that match the 'selectors'.
/*
https://www.w3schools.com/cssref/css_selectors.asp
.class1.class2	.name1.name2	Selects all elements with both name1 and name2 set within its class attribute
.class1 .class2	.name1 .name2	Selects all elements with name2 that is a descendant of an element with name1
element>element	div > p	Selects all <p> elements where the parent is a <div> element
*/

// Enabling Prettier for js/css/html automatic formatting:
// https://www.youtube.com/watch?v=zd_aDbwr4pY&ab_channel=StudyZone

// -- flags ------------------------------------------------------------------------
// - @testing
// Real test cases to monitor: 65220 --> when Test status changes to "tested".
// - @todo
// - @feature

// ---------------------------------------------------------------------------------

// --- Config ----------------------------------------------------------------------

// Can't request everyone to put in their API key because it's too much of a hassle
var redmineApiToken = "97f301157f2afdc96676e988ceb58eea2d78602c";

var fieldSchema = {
  status: {
    displayName: "Status",
    value: {
      type: "dropdown",
      options: [
        "Pending Approval",
        "New",
        "In Progress",
        "Resolved",
        "Feedback",
      ],
    },
  },
  mr_status: {
    displayName: "MR Status",
    value: {
      type: "dropdown",
      options: ["NONE", "WIP", "REVIEW", "DONE"],
    },
  },
  test_status: {
    displayName: "Test status",
    value: {
      type: "dropdown",
      options: ["not tested", "tested"],
    },
  },
  deployed_in_sandbox: {
    displayName: "Deployed in Sandbox",
    value: {
      type: "dropdown",
      options: ["Empty", "Not empty"],
    },
  },
  deployed_in_live: {
    displayName: "Deployed in Live",
    value: {
      type: "dropdown",
      options: ["Empty", "Not empty"],
    },
  },
};

let valueDiv = document.querySelector("#field");

for (let i of Object.values(fieldSchema)) {
  // --- Insert "field" dropdown options

  console.log(i);

  // // Insert "field value" dropdown options
  // // for option in options
  // if (type === "dropdown") {
  //   for ()

  //   if option === "Empty" {

  //   valueDiv?.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`);
  // } else {
  //   // @feature
  // }
}

// ---------------------------------------------------------------------------------

// --- Get current Redmine page details --------------------------------------------
/**
 * If possible (if the currently loaded page is a Redmine task page), then get task
 * details. It needs to happen after the page loads. If the page is not a Redmine
 * task page or it is a support task @feature, then skip this part.
 */

// -- Auto-fill details from the current development task page data ----------------
try {
  // Check if the page has loaded before attempting to retrieve values
  document.onreadystatechange = function () {
    // Possible values: 'loading', 'interactive', 'complete'
    if (document.readyState === "interactive") {
      var taskType: string;

      // --- Detect project --------------------------------------------------
      // Make sure that parsed keywords in the main text title are avoided.
      // let taskTitle = document.querySelectorAll("head > title").textContent

      /**
       * Input: "Task #63383: ISAC-IS-CORE: Add TransLink field to the Currency Exchange XML Issuer Report - ISAC-ISS - Tribe Payments"
       * Output: " - ISAC-ISS - Tribe Payments"
       */
      let taskTitle: string = document.title.slice(-28);

      if (taskTitle.includes("Support - ")) {
        taskType = "Support";
      } else {
        taskType = "Development";
      }

      // If the project has been found and it is equal to "Development", then try
      // to get other relevant task details.
      if (taskType === "Development") {
        // Task ID
        var redmineTaskNumber: string = window.location.href
          .split("/issues/")[1]
          .substring(0, 5);
        // Status
        var redmineTaskStatus: string | null | undefined =
          document.querySelector(".status.attribute > .value")?.textContent;
        // MR status
        var redmineMrStatus: string | null | undefined = document.querySelector(
          ".cf_26.attribute > .value"
        )?.textContent;
        // Test status
        var redmineTestStatus: string | null | undefined =
          document.querySelector(".cf_4.attribute > .value")?.textContent;
        // Deployed to Sandbox status
        // Note: Empty field returns an empty string.
        var redmineDeployedToSandbox: string | null | undefined =
          document.querySelector(".cf_11.attribute > .value")?.textContent;
        /*
                console.log(redmineTaskStatus)
                console.log(redmineTestStatus)
                console.log(redmineMrStatus)
                console.log(redmineDeployedToSandbox)
                */
        // Deployed to Live status
        // --> this is unnecessary, as there are no more assumptions to make if the task
        // is deployed to live
        // -
      } else if (taskType === "Support") {
        // @feature
      }
    }
  };
} catch (error) {
  //   console.log(error);
}

// // ---------------------------------------------------------------------------------

// // --- Validate data ---------------------------------------------------------------

// // // -- 'Add task' button availability (disabled if input is not valid)
// // // Disabled by default. Enabled when validation is passed.
// // var buttonIsDisabled = true;

// // // -- Validate "Task ID" input
// // if (
// //   (RedmineTaskNumber.length !== 5 && RedmineTaskNumber !== "") ||
// //   isNaN(RedmineTaskNumber)
// // ) {
// //   // isNaN checks if the value is a number
// //   // How to add a warning message to the input field: https://stackoverflow.com/questions/18954388/how-to-display-error-message-next-to-textbox-in-javascript
// //   // inputPropsRedmineTaskNumber.helperText = 'Incorrect value';
// // } else {
// //   // inputPropsRedmineTaskNumber.helperText = '';
// //   buttonIsDisabled = false;
// // }

// // ---------------------------------------------------------------------------------

// // --- User analytics --------------------------------------------------------------

// // -- User ID (for user analytics)
// /** Send data whenever a user creates a new alert.
//  *
//  *
//  */

// // User ID
// // Try because

// // the user might not be in the Development task page
// try {
//   var userLink = document.querySelector("#loggedas a").textContent;
//   var userID = userLink.match(/(\d*)$/i)[0];

//   // Send data to Google sheet (TODO create statistics sheet and test writing to it.)
//   // ID are mapped in the Google sheet
//   let body = {
//     [new Date().getTime()]: {
//       date: new Date(),
//       redmineTaskNumber: userID,
//       redmineTaskStatus: RedmineTaskNumber,
//       redmineMrStatus: RedmineTaskStatus,
//       redmineTestStatus: RedmineTaskStatus,
//       redmineDeployedToSandboxStatus: RedmineTaskStatus,
//     },
//   };

//   // select where body.id = "1384185442"

//   // fetch('https://example.com') // POST
//   // include credentials: true
// } catch (error) {
//   //   console.log(error);
// }

// // ---------------------------------------------------------------------------------

// // --- Add/Preview/Delete alerts using Local Storage -------------------------------

// // TODO

// // // Set Item
// // /* localStorage.setItem(key, value); */
// // function saveNoteToLocalStorage() {
// //   localStorage.setItem(
// //     RedmineTaskNumber,
// //     document.querySelector("#issue_notes").value
// //   );
// // }

// // // Retrieve
// // /* let lastname = localStorage.getItem(key); */
// // // On-load --> set the textarea to the last saved value
// // document.querySelector("#issue_notes").value =
// //   localStorage.getItem(RedmineTaskNumber);

// // // Local storage for this particular page is cleared upon clicking "Submit"
// // function clearNoteFromLocalStorage() {
// //   localStorage.removeItem(RedmineTaskNumber);
// // }

// // ---------------------------------------------------------------------------------

// // --- Send a request to Redmine every 3 minutes -----------------------------------

// // Need to handle (when sending only. Writing and reading to memory is raw.)
// options: [
//   "Empty",
//   "Not empty"
// ],

// var dummyDataLocalStorage1 = {
//   [new Date().getTime()]: {
//     date: new Date("08/02/2022"),
//     redmineTaskNumber: "61253",
//     redmineTaskStatus: "Resolved",
//     redmineMrStatus: "NONE",
//     redmineTestStatus: "not tested",
//     redmineDeployedToSandboxStatus: "",
//   },
//   [new Date().getTime() - 2563]: {
//     date: new Date("06/02/2022"),
//     redmineTaskNumber: "61685",
//     redmineTaskStatus: "In progress",
//     redmineMrStatus: "WIP",
//     redmineTestStatus: "not tested",
//     redmineDeployedToSandboxStatus: "",
//   },
// };

// // dummyDataLocalStorage1['54512314'].RedmineTaskStatus === "Resolved";

// // Sending a request
// function redmineRequest() {}

// // Comparing values to Local Storage
// function checkIfTriggerred() {
//   // Get value from local storage

//   // Display value in the DOM
//   var addValueDiv = document
//     .querySelector("#addValue")
//     .appendChild(document.createElement("<hr>"));

//   // Source: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
//   // document.createElement('block').appendChild( document.createElement('b') );
//   // <option value="status">-</option>
// }

// // Raise an alert
// function raiseAlert() {}

// // ---------------------------------------------------------------------------------
