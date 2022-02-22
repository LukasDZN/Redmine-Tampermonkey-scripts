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


sample: https://chrome.google.com/webstore/search/redmine  -> people are also adding API key / domain in config, just as me.
Notification: https://chrome.google.com/webstore/detail/redmine-notification/cenhhgabijhpobnfnmkigobcefkmhjbj

View related: https://chrome.google.com/webstore/detail/redmine-notification/cenhhgabijhpobnfnmkigobcefkmhjbj




Chrome Extension API:
https://developer.chrome.com/docs/extensions/reference/

