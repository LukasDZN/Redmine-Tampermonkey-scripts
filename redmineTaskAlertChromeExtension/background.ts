// // @ts-ignore


// // var localStorageItems;

// // Send a request to the main script to retrieve localStorage items.
// // broadcastChannel1.postMessage({workerRequestType: "getLocalStorageItems"});
// // Receiving a response
// // broadcastChannel1.onmessage = (event) => {
// //   console.log(`Service worker received response from main popup script. ${new Date()}`);
// //   // localStorageItems = event.data;
// //   // console.log(localStorageItems);
// //   // @TODO: What data is getAndParseLocalStorageItems expecting to receive? Cuz this is an object
// // }

// // const broadcastChannel2 = new BroadcastChannel("channel1");
// // // const broadcastChannel1 = new BroadcastChannel('channel1');
// // console.log("Service worker activated.");
// // setInterval(async () => {
// //   console.log("Service worker setInterval tick.");
// //   // broadcastChannel2.postMessage({workerRequestType: "checkIfTriggered"});
// //   alert("50245 something");
// // }, 5000);

// // Imports

// // https://stackoverflow.com/questions/67510470/how-to-import-js-file-to-background-js-in-chrome-extension-from-the-same-folder

// // Constants

// const redmineApiToken = "97f301157f2afdc96676e988ceb58eea2d78602c";

// // ---------------------------------------------------------------------------------

// // // --- Send a request to Redmine every 3 minutes -----------------------------------

// // Extension script CORS privilege - extensions have higher privileges and can perform CORS requests.
// // https://stackoverflow.com/questions/48615701/why-can-tampermonkeys-gm-xmlhttprequest-perform-a-cors-request
// const sendRequest = async (taskId: string) => {
//   try {
//     const redmineResponse = await fetch(
//       `https://redmine.tribepayments.com/issues/${taskId}.json`,
//       // `https://tribeapp.website:5000/api/getRedmineTaskProxy/${taskId}`,
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

// const checkIfTaskIsTriggered = () => {
//   setInterval(async () => {
//     // for each item in localStorage with status triggeredInThePast == "no"
//     let localStorageItems = getAndParseLocalStorageItemsF(); // https://stackoverflow.com/questions/35758584/cannot-redeclare-block-scoped-variable
//     for (let key in localStorageItems) {
//       if (localStorageItems[key].triggeredInThePast === "no") {
//         // console.log('Request sent to Redmine for task ID: "' + key + '"');
//         let redmineResponse = await sendRequest(key);
//         // @ts-ignore
//         // JSON.parse(redmineResponse); vs redmineResponse.json() -> Use second one. It's meant for fetch requests.
//         let responseObject = await redmineResponse.json();
//         // console.log('Redmine response -> Status: ' + responseObject.issue.status.name)

//         // Have to separate Status check and Custom field check because of different query
//         // (e.g. responseObject.issue.custom_fields[0].value vs responseObject.issue.status.name)
//         if (localStorageItems[key].fieldToCheck === "Status") {
//           // Check if triggered. Value must match.
//           if (
//             responseObject.issue.status.name ===
//             localStorageItems[key].valueToCheck
//           ) {
//             localStorageItems[key].triggeredInThePast = "yes";
//             localStorageItems[key].triggeredAtDate = new Date();
//             localStorage.setItem(key, JSON.stringify(localStorageItems[key]));
//             raiseAlert(key);
//           } else {
//             //
//           }
//           // Check if Field is a custom_field
//         } else {
//           for (let customField of responseObject.issue.custom_fields) {
//             if (customField.name === localStorageItems[key].fieldToCheck) {
//               if (customField.value === "Empty") {
//                 customField.value = "";
//               } else if (customField.value === "Not empty") {
//                 // @feature ???
//               }
//               if (customField.value === localStorageItems[key].valueToCheck) {
//                 localStorageItems[key].triggeredInThePast = "yes";
//                 localStorageItems[key].triggeredAtDate = new Date();
//                 localStorage.setItem(
//                   key,
//                   JSON.stringify(localStorageItems[key])
//                 );
//                 raiseAlert(key);
//               }
//             } else {
//               // console.log(`customField.name === localStorageItems[key].fieldToCheck -> ${customField.name} === ${localStorageItems[key].fieldToCheck}`);
//             }
//           }
//         }
//         await sleep(300);
//       }
//     }
//   }, 10000); // @testing - 10 seconds
// };

// // checkIfTaskIsTriggered();

// // Raise an alert via Desktop notification
// // @feature - can add text with changes what happened to the ticket
// function raiseAlert(taskId: string | number) {
//   // Source for notification standard: https://notifications.spec.whatwg.org/#using-events

//   console.log("raiseAlert was run...");

//   // // Let's check if the browser supports notifications
//   // if (!("Notification" in window)) {
//   //   alert("This browser does not support desktop notifications.");
//   // }

//   // // Let's check whether notification permissions have already been granted
//   // else if (Notification.permission === "granted") {
//   //   // If it's okay let's create a notification
//   //   var notification = new Notification(`
//   //       Task ID: ${taskId} has triggered an alert.
//   //     `);
//   //   window
//   //     .open(`https://redmine.tribepayments.com/issues/${taskId}`, "_blank")
//   //     ?.focus();
//   // }

//   chrome.action.setBadgeText({text: "*"})

//   chrome.action.setBadgeBackgroundColor(
//     {color: '#00FF00'},  // Also green
//     () => { /* ... */ },
//   );

//   chrome.tabs.create({
//     url: `https://redmine.tribepayments.com/issues/${taskId}`,
//     active: true,
//   });

//   // let statusName = "Status";
//   // let triggerStatus = "New";
//   // let currentStatus = "In progress";
//   // setTimeout(() => {
//   //   alert(
//   //     `🌠 Redmine task notification: ${statusName} has just changed from ${triggerStatus} to ${currentStatus}!`
//   //   );
//   // }, 3000);

//   // Otherwise, we need to ask the user for permission
//   // else if (Notification.permission !== "denied") {
//   //   Notification.requestPermission().then(function (permission) {
//   //     // If the user accepts, let's create a notification
//   //     if (permission === "granted") {
//   //       // var notification = new Notification("Hi there!");
//   //     }
//   //   });
//   // }
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

// const getAndParseLocalStorageItemsF = () => {
//   raiseAlert("60001");
//   return;
//   // Init an object to store all the items
//   let localStorageItems: any = {};
//   // Get an array of all the localStorage keys (i.e. task IDs)
//   var arrayOfKeys = Object.keys(localStorage);
//   // For every key in the array, get the value and display it
//   for (let key of arrayOfKeys) {
//     try {
//       // Console log raw keys and values
//       // console.log(key); // log keys
//       // console.log(localStorage.getItem(key)); // log values

//       let valueString: string | null = localStorage.getItem(key);
//       let valueObject = JSON.parse(valueString!);

//       console.log(
//         "key: " +
//           key +
//           " | " +
//           "valueObject.fieldToCheck: " +
//           valueObject.fieldToCheck +
//           " | " +
//           "triggered in the past?: " +
//           valueObject.triggeredInThePast
//       );
//       localStorageItems[key] = valueObject;
//     } catch (error) {
//       console.log("displayLocalStorageItems ERROR: " + error);
//     }
//   }
//   return localStorageItems;
// };

// // https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
// //These make sure that our function is run every time the browser is opened.
// chrome.runtime.onInstalled.addListener(function () {
//   initialize();
// });
// chrome.runtime.onStartup.addListener(function () {
//   initialize();
// });

// function initialize() {
//   setInterval(async function () {
//     console.log(await sendRequest("60001"));
//     console.log(getAndParseLocalStorageItemsF());
//   }, 10000);
// }

// // ---
// // Once a request to Redmine triggers an alert, send updated localStorage value to the main script.
// // Which will then actually update the localStorage value.
// // broadcastChannel1.postMessage({key: value});
