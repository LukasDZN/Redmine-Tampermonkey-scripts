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

// const broadcastChannel2 = new BroadcastChannel("channel1");
// // const broadcastChannel1 = new BroadcastChannel('channel1');
// console.log("Service worker activated.");
// setInterval(async () => {
//   console.log("Service worker setInterval tick.");
//   // broadcastChannel2.postMessage({workerRequestType: "checkIfTriggered"});
//   alert("50245 something");
// }, 5000);






  //These make sure that our function is run every time the browser is opened.
chrome.runtime.onInstalled.addListener(function () {
	initialize();
});
chrome.runtime.onStartup.addListener(function () {
	initialize();
});
function initialize() {
	setInterval(function () {
		sendRequest('60001');
	}, 10000);
}
async function sendRequest(taskId) {
  try {
      // Define the request
      const redmineResponse = await fetch(`https://redmine.tribepayments.com/issues/${taskId}.json`, 
          {
            method: "GET",
            headers: { 
              "Accept": "application/json",
              "X-Redmine-API-Key": "97f301157f2afdc96676e988ceb58eea2d78602c"
          },
          body: null
      });
      // Call the fetch task journals function
      const redmineResponseJson = await redmineResponse.json();
      console.log(redmineResponseJson)

      // Create a separate browser window as an alternative to a notification
      // chrome.windows.create({
      //   focused: true,
      //   width: 400,
      //   height: 600,
      //   type: 'popup',
      //   url: 'popup.html',
      //   top: 0,
      //   left: 0
      // },
      // () => {})

      // Create a notification
      chrome.notifications.create('NOTIFICATION_ID', {
        type: 'basic',
        iconUrl: 'path',
        title: 'notification title',
        message: 'notification message',
        priority: 2
    })

    // Update chrome extension icon

      return redmineResponseJson;
  } catch (error) {
      console.log("getRedmineTaskProxy error: " + error);
      return "error";
  }
};
}






// ---
// Once a request to Redmine triggers an alert, send updated localStorage value to the main script.
// Which will then actually update the localStorage value.
// broadcastChannel1.postMessage({key: value});
