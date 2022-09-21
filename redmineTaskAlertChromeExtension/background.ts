// @ts-nocheck

// https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
// These make sure that our function is run every time the browser is opened.
chrome.runtime.onInstalled.addListener(function () {
  initialize();
});
chrome.runtime.onStartup.addListener(function () {
  initialize();
});

// async function initialize() {
//     const storageLocalObjects = await asyncGetStorageLocal(null)
//     const settingsObject = storageLocalObjects.redmineTaskNotificationsExtensionSettings
//     const alertCheckFrequencyInSeconds = settingsObject.refreshIntervalInSeconds
//     setInterval(async function () {
//         await main()
//     }, alertCheckFrequencyInSeconds * 1000);
// }
// Should use an alarm https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

async function initialize() {
    await main()
}

const main = async () => {
    const storageLocalObjects = await asyncGetStorageLocal(null);
    let wasArrayUpdated = false;

    let d = new Date();
    let newDateFormatted = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    let alertObjectArray = storageLocalObjects.redmineTaskNotificationsExtension
    if (alertObjectArray) {
        let editedObjectsOfAlertObjectArray = [];
        for (const alertObject of alertObjectArray) {
            if (alertObject.triggeredInThePast === false) {
                console.log('found an active alert')
                let redmineTaskTextDom = await sendRequestAndGetTextDom(alertObject.redmineTaskId)
                console.log(redmineTaskTextDom)
                console.log('value to check: ' + alertObject.valueToCheckValue)
                console.log('value parsed from text dom: ' + getValueFromTextDom(redmineTaskTextDom, alertObject.fieldToCheckValue))
                if (getValueFromTextDom(redmineTaskTextDom, alertObject.fieldToCheckValue) === alertObject.valueToCheckValue) {
                    if (wasArrayUpdated === false) {wasArrayUpdated = true}
                    // Create an updated alert object
                    alertObject.triggeredInThePast = true;
                    alertObject.triggeredAtTimestamp = new Date().getTime();
                    alertObject.triggeredAtReadableDate = newDateFormatted;
                    editedObjectsOfAlertObjectArray.push(alertObject)

                    // Trigger an alert
                    const extensionSettingsObject = storageLocalObjects.redmineTaskNotificationsExtensionSettings
                    if (extensionSettingsObject) {
                        if (extensionSettingsObject.browserAlertEnabled === true) {
                            alert(
                                `#${alertObject.redmineTaskId} triggered an alert. 
                                Field "${alertObject.fieldToCheckLabel}" value "${alertObject.valueToCheckLabel}" has changed (at ${alertObject.triggeredAtReadableDate}).`
                            )
                        }
                    }

                }
            }
        }
        if (wasArrayUpdated === true) {
            const updatedAlertObjectArray = replaceObjectsInOriginalArrayWithOtherArrayObjects(alertObjectArray, editedObjectsOfAlertObjectArray, 'uniqueTimestampId')
            asyncSetStorageLocal('redmineTaskNotificationsExtension', updatedAlertObjectArray)
            console.log('At least one alert was triggered during main() check...')
        } else if (wasArrayUpdated === false) {
            console.log('No alerts were triggered during main() check...')
        }
    }
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
        let htmlString = await redmineResponse.text()

        // Send htmlString to content script and retrieve element value for id = alertObject.fieldToCheckValue
        

        return htmlString;
    } catch (error) {
        console.log("ERROR in sendRequest func" + error);
        return "ERROR in sendRequest func";
    }
};

const getValueFromTextDom = (string, fieldId) => {
    let regex = new RegExp(`id="${fieldId}".+value="([0-9]+)"`);
    let match = regex.exec(string);
    return match[1]; // [1] is the group that's found
}

function asyncGetStorageLocal(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    });
}

function asyncSetStorageLocal(key, newValue) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({[key]: newValue}, resolve);
    });
}

const replaceObjectsInOriginalArrayWithOtherArrayObjects = (initialArray, replacementValueArray, key) => {
    return initialArray.map(obj => replacementValueArray.find(o => o[key] === obj[key]) || obj);
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



