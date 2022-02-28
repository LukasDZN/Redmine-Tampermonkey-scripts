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

# Last session notes:
- Importing has been postponed because it is too tedious.
- Service workers seems to be able to successfully receive messages from the main script. -> need worker to parse the data correctly -> see if it can successfully create an alert
- Why is popup js being called so many times?
- Why are there errors in the general page console (meanwhile popup console is clear/okay)
- Send information back to main script in order to update the localStorage
- Final testing -> does the script keep properly functioning while popup is closed? (even when browsing websites different than Redmine)