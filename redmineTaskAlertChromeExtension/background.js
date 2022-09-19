"use strict";
// @ts-nocheck
const alertCheckFrequencyInSeconds = 20;
// Read storage.local - get needed results, for each result send a request, compare results, raise an alert and update storage.local object if there's a match
// Need to parse the DOM somehow
// https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
// These make sure that our function is run every time the browser is opened.
chrome.runtime.onInstalled.addListener(function () {
    initialize();
});
chrome.runtime.onStartup.addListener(function () {
    initialize();
});
function initialize() {
    setInterval(async function () {
        main();
    }, alertCheckFrequencyInSeconds * 1000);
}
// Should use an alarm https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/
const main = async () => {
    chrome.storage.sync.get('redmineTaskNotificationsExtension', function (data) {
        if (data.redmineTaskNotificationsExtension) {
            let alertObjectArray = data.redmineTaskNotificationsExtension;
            alertObjectArray.forEach(function (alertObject) {
                if (alertObject.triggeredInThePast === false) {
                    let redmineTaskDom = await sendRequestAndGetDom(alertObject.redmineTaskId);
                    // if (redmineTaskDom.querySelector("#issue_status_id").value === alertObject.valueToCheckValue) {
                    // Update alert object
                    // let alertObjectArray = data.redmineTaskNotificationsExtension
                    // alertObjectArray.forEach(function(object, index) {
                    //     if (object.uniqueTimestampId === uniqueTimestampId) {
                    //     alertObjectArray.splice(index, 1)
                    //     chrome.storage.sync.set({'redmineTaskNotificationsExtension': alertObjectArray}, function() {
                    //         console.log(`chrome.storage.sync active alert id ${alertObject.redmineTaskId} was triggered...`);
                    //     });
                    //     }
                    // });
                    // Trigger an alert
                    //     console.log('an alert was triggered!...')
                    // }
                }
            });
        }
    });
};
const sendRequestAndGetDom = async (taskId) => {
    try {
        const redmineResponse = await fetch(`https://redmine.tribepayments.com/issues/${taskId}`, {
            method: "GET",
            headers: {},
            body: null,
        });
        let parsedResponse = await redmineResponse.text();
        console.log(parsedResponse);
        // let parser = new DOMParser();
        // let htmlDoc = parser.parseFromString(parsedResponse, 'text/html');
        return htmlDoc;
    }
    catch (error) {
        console.log("ERROR in sendRequest func" + error);
        return "ERROR in sendRequest func";
    }
};
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
