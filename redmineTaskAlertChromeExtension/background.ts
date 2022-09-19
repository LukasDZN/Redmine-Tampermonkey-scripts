// @ts-nocheck

const alertCheckFrequencyInSeconds = 20

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
    main()
  }, alertCheckFrequencyInSeconds * 1000);
}
// Should use an alarm https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

const main = async () => {

    chrome.storage.sync.get('redmineTaskNotificationsExtension', function(data) {
        let d = new Date();
        let newDateFormatted = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

        if (data.redmineTaskNotificationsExtension) {
            let alertObjectArray = data.redmineTaskNotificationsExtension;
            let newAlertObjectArray = [];
            
            alertObjectArray.forEach(function(alertObject) {
                if (alertObject.triggeredInThePast === false) {
                    let redmineTaskTextDom = await sendRequestAndGetDom(alertObject.redmineTaskId)
                    if (getValueFromTextDom(redmineTaskTextDom, 'issue_status_id') === alertObject.valueToCheckValue) {
                        // Update alert object
                        alertObject.triggeredInThePast = true;
                        alertObject.triggeredAtTimestamp = new Date().getTime();
                        alertObject.triggeredAtReadableDate = newDateFormatted;


                        // Build new array of objects

                        // Set new array
                        

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
    })

};

const sendRequestAndGetTextDom = async (taskId) => {
    try {
        const redmineResponse = await fetch(
            `https://redmine.tribepayments.com/issues/${taskId}`,
            {
                method: "GET",
                headers: {},
                body: null,
            }
        );
        let parsedResponse = await redmineResponse.text()
        // https://www.npmjs.com/package/xmldom
        // let parser = new DOMParser();
        // let htmlDoc = parser.parseFromString(parsedResponse, 'text/html');
        return parsedResponse;
    } catch (error) {
        console.log("ERROR in sendRequest func" + error);
        return "ERROR in sendRequest func";
    }
};

const getValueFromTextDom = (string, fieldId) => {
    // let fieldId = 'issue_status_id'
    // let string = `<p><label for="issue_status_id">Status<span class="required"> *</span></label><select onchange="updateIssueFrom(&#39;/issues/69265/edit.js&#39;, this)" name="issue[status_id]" id="issue_status_id"><option selected="selected" value="11">Not Approved</option>`;
    let regex = new RegExp(`id="${fieldId}".+value="([0-9]+)"`);
    let match = regex.exec(string);
    return match[1]; // [1] is the group that's found
}






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



