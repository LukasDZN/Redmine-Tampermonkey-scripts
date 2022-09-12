"use strict";
// @ts-nocheck
function parseRedmineTaskDropdownFieldsToArrayOfObjects() {
    let arrayOfDropdownObjects = [];
    document.querySelectorAll('#all_attributes select').forEach(function (taskFieldHtmlElement) {
        if (taskFieldHtmlElement.previousElementSibling) {
            const id = taskFieldHtmlElement.id;
            let label = taskFieldHtmlElement.previousElementSibling.textContent;
            if (label) {
                label = label?.replace(" *", "");
            }
            const selectedOptionValue = taskFieldHtmlElement.value;
            const possibleOptionsValues = [...taskFieldHtmlElement].map(el => new Object({
                optionValue: el.value,
                optionText: el.text,
                isSelected: selectedOptionValue === el.value ? true : false
            }));
            const optionObject = {
                id: id,
                label: label,
                value: {
                    type: "dropdown",
                    options: possibleOptionsValues,
                }
            };
            arrayOfDropdownObjects.push(optionObject);
        }
    });
    return arrayOfDropdownObjects;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'parseRedmineTaskDropdownFieldsToArrayOfObjects') {
        sendResponse({
            data: parseRedmineTaskDropdownFieldsToArrayOfObjects()
        });
    }
    return true; // include 'true' otherwise it might close too early.
});
