Why make it public? I have to make it public to everyone with a link, so API key / domain must be configurable either way.
Bonus is that someone might start using it, which is pretty cool.

Do I make it public to all or not? --> need to search whether an extension can be made private.
"You can use "Visibility Option" - while publishing. This way your extension will not searchable but anyone with link can install/use it. This is useful to get early feedback on new extension." --> still API key must be private.

It's probably not that hard to make fields configurable.

If I want it so that the extension can be published publically - API key / Domain needs to be configurable.
Fields to choose should also be configurable (and probably exportable - so GUI would create an exportable JSON config). -> then I would prepare a config for Tribe, but also other companies could create their own configs and share with others.

How do I not make it so that Tribe people need to upload configs and whatnot? --> make a sample / default config?

Need to guide users how to select new fields (like how to find ID of a field or a custom field).

Will need to implement a config window --> just redirect to a page and that's it - save to local storage / add screenshots if needed.

Feature:

- Configurable fields to track (exportable config)
- Configurable request sending interval
- Task to track auto-prediction
- Historical log
- Usage statistics would be hard to track if other users were to use it.. although maybe still good to know who's using it, I wonder what stats does chrome store provide -> in my sheet, it would simply say what domain name is using the API. -> is it legal / how are others doing it?

sample: https://chrome.google.com/webstore/search/redmine -> people are also adding API key / domain in config, just as me.
Notification: https://chrome.google.com/webstore/detail/redmine-notification/cenhhgabijhpobnfnmkigobcefkmhjbj

View related: https://chrome.google.com/webstore/detail/redmine-notification/cenhhgabijhpobnfnmkigobcefkmhjbj

Chrome Extension API:
https://developer.chrome.com/docs/extensions/reference/

Fetch() returns a readable stream -> JSON.stringify() vs response.json() - the latter is better. Also it returns a fully processed string instead of needing to read the stream.
https://stackoverflow.com/questions/59897013/why-fetch-uses-readablestream-for-body-of-the-response

You can only query the extension popup itself, but not the active tab. For active tab you need to use extension API.

Script is only running once the popup.html is active. Service workers need to be implemented in order for it to run in background.
https://stackoverflow.com/questions/53179680/how-to-keep-script-running-when-extension-popup-is-closed




# Types of workers:

## Main
Web workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

## Other types of worker
In addition to dedicated and shared web workers, there are other types of worker available:

- ServiceWorkers essentially act as proxy servers that sit between web applications, and the browser and network (when available). They are intended to (amongst other things) enable the creation of effective offline experiences, intercepting network requests and taking appropriate action based on whether the network is available and updated assets reside on the server. They will also allow access to push notifications and background sync APIs.
- Audio Worklet provide the ability for direct scripted audio processing to be done in a worklet (a lightweight version of worker) context.

Communication between service worker and main client -> Broadcast channel API (easier method):
https://stackoverflow.com/questions/40887635/access-localstorage-from-service-worker


Service workers remain active when clicking away from popup.


https://www.w3.org/TR/service-workers-1/#service-worker-global-scope-fetch-event

https://stackoverflow.com/questions/29741922/prevent-service-worker-from-automatically-stopping

Migrating from background pages to service workers
https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

Service Workers: an Introduction  |  Web Fundamentals  |  Google Developers
https://developers.google.com/web/fundamentals/primers/service-workers/

Manage events with service workers - Chrome Developers
https://developer.chrome.com/docs/extensions/mv3/service_workers/

Using Web Workers - Web APIs | MDN
https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers


Travesty Media video:
https://www.youtube.com/watch?v=ksXwaWHCW6k&ab_channel=TraversyMedia


Manifest 3 fields and explanations
https://developer.chrome.com/docs/extensions/mv3/manifest/

Keeping a service worker awake:
https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension

https://stackoverflow.com/questions/29741922/prevent-service-worker-from-automatically-stopping

# Last session notes:
- [NOTED] Importing has been postponed because it is too tedious.
- [IN-PROGRESS] Service workers seems to be able to successfully receive messages from the main script. -> need worker to parse the data correctly -> see if it can successfully create an alert

A worker is kept alive for each tab that the popup.html is opened. -> it should check if a worker is active. If active, don't spawn, if no active workers -> spawn a worker. But that means you have to open the popup at least once for the script to run. A single worker should be running continuely without the need for activation.

- When re-opening inspect -> nothing happens
- When re-opening popup   -> old service worker call is shown, but also a new one is initiated.

- Why is popup js being called so many times?
- Why are there errors in the general page console (meanwhile popup console is clear/okay)
- Send information back to main script in order to update the localStorage
- Final testing -> does the script keep properly functioning while popup is closed? (even when browsing websites different than Redmine)
- Prettify CSS / clean up code


At this point it's easier to move the extension to a web page -> all you'd have to do is keep a tab open. The code could be re-used, but it would be making API calls to MERNPy backend. 
MERNPy would just act like a proxy, simply forwarding the requests.

The only way that I know of now would be to make the service worker persist indefinitely in the background, also use a shared service worker to stop spawning multiple workers, and then see if it really works as planned. Otherwise, extensions need to be clicked on to work at all, and also clicked on to initiate a service worker.




Keep one tab open, with one service worker running (after having clicked on the popup once).
On popup update (entering a new Task ID / status to check) -> it should send the new data to the background.ts worker again. Otherwise, as its running, it will keep checking for old info.
- Make sure that the service worker persists. -> upon extension refresh, the worker seems to persist indefinitely, without the need to even open the popup in the first place.

The extension tab worker goes on every 5sec, and is not impacted by additional tab opened -> popup opened. Even when closed, opened again, etc.
The popup console however, shows both, the extension original worker, and creates a new worker (2x the message printing). Is the worker alive when the popup is closed tho? Don't know. 

Okay so it works. I just need to use the actual code, and make sure the worker keeps requesting updated local storage as well. No need to have the tab open, just need to check that it keeps running in the background, find the conditions that kill it.


Service worker dies if all of the tabs that were opened when it was first started are closed. So you gotta start the extension and keep the tab open somewhere, otherwise there's a risk it will just stop at some point.


Could the worker simply call the popup script every 5sec, and that's it? No need to handle different data types, tranfering messages between the main script and the service worker. -> nope, it service worker doesn't activate the main script, also service worker cannot raise alerts by itself.
The features are too experimental / new, there's a lack of tutorials for this to be implemented.