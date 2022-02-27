"use strict";
// import { getAndParseLocalStorageItems } from "./popup.js";
// // ---------------------------------------------------------------------------------
// // // --- Send a request to Redmine every 3 minutes -----------------------------------
// // Extension script CORS privilege:
// // https://stackoverflow.com/questions/48615701/why-can-tampermonkeys-gm-xmlhttprequest-perform-a-cors-request
// const sendRequest = async (taskId: string) => {
//   try {
//     const redmineResponse = await fetch(
//       `https://redmine.tribepayments.com/issues/${taskId}.json`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "X-Redmine-API-Key": redmineApiToken,
//         },
//         body: null,
//       }
//     );
//     return redmineResponse;
//   } catch (error) {
//     console.log("ERROR in sendRequest func" + error);
//     return "ERROR in sendRequest func";
//   }
// };
// setInterval(async () => {
//   // for each item in localStorage with status triggeredInThePast == "no"
//   let localStorageItems = getAndParseLocalStorageItems();
//   for (let key in localStorageItems) {
//     if (localStorageItems[key].triggeredInThePast === "no") {
//       // console.log('Request sent to Redmine for task ID: "' + key + '"');
//       let redmineResponse = await sendRequest(key);
//       // @ts-ignore
//       // JSON.parse(redmineResponse); vs redmineResponse.json() -> Use second one. It's meant for fetch requests.
//       let responseObject = await redmineResponse.json();
//       // console.log('Redmine response -> Status: ' + responseObject.issue.status.name)
//       // Have to separate Status check and Custom field check because of different query
//       // (e.g. responseObject.issue.custom_fields[0].value vs responseObject.issue.status.name)
//       if (localStorageItems[key].fieldToCheck === "Status") {
//         // Check if triggered. Value must match.
//         if (
//           responseObject.issue.status.name ===
//           localStorageItems[key].valueToCheck
//         ) {
//           localStorageItems[key].triggeredInThePast = "yes";
//           localStorageItems[key].triggeredAtDate = new Date();
//           localStorage.setItem(key, JSON.stringify(localStorageItems[key]));
//           raiseAlert(key);
//         } else {
//           //
//         }
//         // Check if Field is a custom_field
//       } else {
//         for (let customField of responseObject.issue.custom_fields) {
//           if (customField.name === localStorageItems[key].fieldToCheck) {
//             if (customField.value === 'Empty') {
//               customField.value = '';
//             } else if (customField.value === 'Not empty') {
//               // @feature ???
//             }
//             if (customField.value === localStorageItems[key].valueToCheck) {
//               localStorageItems[key].triggeredInThePast = "yes";
//               localStorageItems[key].triggeredAtDate = new Date();
//               localStorage.setItem(key, JSON.stringify(localStorageItems[key]));
//               raiseAlert(key);
//             }
//           } else {
//             // console.log(`customField.name === localStorageItems[key].fieldToCheck -> ${customField.name} === ${localStorageItems[key].fieldToCheck}`);
//           }
//         }
//       }
//       await sleep(300);
//     }
//   }
// }, 10000); // @testing - 5 seconds
// // }, 180000); // 3 minutes
// // Raise an alert via Desktop notification
// // @feature - can add text with changes what happened to the ticket
// function raiseAlert(taskId: string | number) {
//   // Source for notification standard: https://notifications.spec.whatwg.org/#using-events
//   // Let's check if the browser supports notifications
//   if (!("Notification" in window)) {
//     alert("This browser does not support desktop notification");
//   }
//   // Let's check whether notification permissions have already been granted
//   else if (Notification.permission === "granted") {
//     // If it's okay let's create a notification
//     var notification = new Notification(`
//         Task ID: ${taskId} has triggered an alert.
//       `);
//     window
//       .open(`https://redmine.tribepayments.com/issues/${taskId}`, "_blank")
//       ?.focus();
//   }
//   // Otherwise, we need to ask the user for permission
//   else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then(function (permission) {
//       // If the user accepts, let's create a notification
//       if (permission === "granted") {
//         // var notification = new Notification("Hi there!");
//       }
//     });
//   }
//   // At last, if the user has denied notifications, and you
//   // want to be respectful there is no need to bother them any more.
//   // // Plan B:
//   // // Open Window on pop-up:
//   // window.open(`https://redmine.tribepayments.com/issues/${taskId}`, '_blank')?.focus();
//   // // Do not allow to close window without confirming:
//   // window.addEventListener('beforeunload', function (e) {
//   //   // Cancel the event
//   //   e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
//   //   // Chrome requires returnValue to be set
//   //   e.returnValue = '';
//   // });
// }
// // ---------------------------------------------------------------------------------
setInterval(async () => {
    console.log('Service worker hello');
}, 50000);
