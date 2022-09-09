# General and to do

_Highest priority on top_

* [DONE] [popup.js,background.js] Move `request`/`alert`/`checking` functions from `popup.js` to `background.js` and check whether they work. -> successfully making requests.
    * [DONE-AUTOMATICALLY] [background.js] background script should suffice to make continuous requests. -> Needs plenty of testing.
* [DONE] [background.js] needs to trigger popup to show an alert. -> check if this works with dummy data
* [DONE] [background.js] changes the icon of the extension to indicate an alert. 
* [popup.js,background.js] should request data from storage.local -> Needs refactoring.

* [popup.js] Restart background.js when popup.js value is updated (when popup.html is closed or a save button is pressed).
    * Might use a broadcastChannel for this. `popup.js` would send a message to `background.js` to restart itself (read and use new storage.local values)
        * Or simply make the `background.js` read local.storage when running every time to make sure the data is up to date.
            * https://developer.chrome.com/docs/extensions/reference/storage/#synchronous-response-to-storage-updates
* [popup.js] Dynamic statuses - retrieve only the current page's possible statuses.
    * A user will only be able to add a task which is already open. Alternative is to fetch possible statuses once the field is selected.

Data schema needs to be done plus using the sync.storage 




# Applying `popup.js` and `background.js`

## popup.js

* popup.js displays and sets storage.local values.
* Restarts the service worker.

## background.js

* A single instance runs continuously and checks the list of redmine tasks for their desired statuses according to storage.local
* When triggered, creates a notification, creates a logo indicator for popup.html and updates storageLocal. 


 
popup:
- Design
- Parse and display fields for current task
- Save and display local storage

1. What kind of options when creating                   2. Data saved when creating 
Create an alert (task ID, field name, field value) -> object is created which later has to be parsed




_Newest on top_


# Types of pages/scripts in which chrome.storage.sync.set can run

* A regular web page has its own page -> Can't run chrome.storage.sync.set
* Extension can have its own page -> Can't run chrome.storage.sync.set
* Extension can have a content script (popup.js) -> can run chrome.storage.sync.set
* Extension can have a background script (background.js) -> -> can run chrome.storage.sync.set


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
