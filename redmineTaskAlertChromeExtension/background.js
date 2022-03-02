"use strict";
// ---------------------------------------------------------------------------------
// Service worker: GET localStorage items from main script
// Service worker can't retrieve values from localStorage.
// So, we need to send a request to the main script to retrieve localStorage items.
// So the service workers acts as a trigger but not as the script that actually does the heavy lifting.
// var localStorageItems;
// Send a request to the main script to retrieve localStorage items.
// broadcastChannel1.postMessage({workerRequestType: "getLocalStorageItems"});
// Receiving a response
// broadcastChannel1.onmessage = (event) => {
//   console.log(`Service worker received response from main popup script. ${new Date()}`);
//   // localStorageItems = event.data;
//   // console.log(localStorageItems);
//   // @TODO: What data is getAndParseLocalStorageItems expecting to receive? Cuz this is an object
// }
const broadcastChannel2 = new BroadcastChannel('channel1');
// const broadcastChannel1 = new BroadcastChannel('channel1');
console.log('Service worker activated.');
setInterval(async () => {
    console.log('Service worker setInterval tick.');
    // broadcastChannel2.postMessage({workerRequestType: "checkIfTriggered"});
    alert("50245 something");
}, 5000);
// ---
// Once a request to Redmine triggers an alert, send updated localStorage value to the main script. 
// Which will then actually update the localStorage value.
// broadcastChannel1.postMessage({key: value});
