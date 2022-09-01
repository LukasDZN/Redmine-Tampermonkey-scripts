# General and to do

_Highest priority on top_

* [popup.js,background.js] Move `request`/`alert`/`checking` functions from `popup.js` to `background.js` and check whether it works.
    * [background.js] background script should suffice to make continuous requests. -> Needs plenty of testing.
* [background.js] needs to trigger popup to show an alert.
* [background.js] changes the icon of the extension to indicate an alert. 
* [popup.js,background.js] should request data from storage.local -> Needs refactoring.

* [popup.js] Restart background.js when popup.js value is updated (when popup.html is closed or a save button is pressed).
    * Might use a broadcastChannel for this. `popup.js` would send a message to `background.js` to restart itself (read and use new storage.local values)
* [popup.js] Dynamic statuses - retrieve only the current page's possible statuses.
    * A user will only be able to add a task which is already open. Alternative is to fetch possible statuses once the field is selected.





# Applying `popup.js` and `background.js`

## popup.js

* popup.js displays and sets storage.local values.
* Restarts the service worker.

## background.js

* A single instance runs continuously and checks the list of redmine tasks for their desired statuses according to storage.local
* When triggered, creates a notification, creates a logo indicator for popup.html and updates storageLocal. 


 






_Newest on top_

# window.localStorage vs chrome.storage.local
https://stackoverflow.com/questions/24279495/window-localstorage-vs-chrome-storage-local

* localStorage - Is not accessible from content scripts (or rather, context scripts share it with the page and not the extension), so you need to rely on Messaging to pass values to them.
* storage.local - Fully available within Content Scripts.

# Background script access to localStorage
https://stackoverflow.com/questions/72159455/access-localstorage-of-chrome-extension-in-background-script

Either passing messages from content to background script, or using chrome.storage.local instead of localStorage.







# Chrome browser extensions concepts

## Resources 

* Official chrome documentation: https://developer.chrome.com/docs/extensions/mv3/overview/

## popup.js and background.js

The background script (background.js) should be viewed as "running in the background of the Chrome browser".
Your desired effect (running a script for every page) is actually a task for content scripts (popup.js).
