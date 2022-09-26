// @ts-nocheck

function parseRedmineTaskDropdownFieldsToArrayOfObjects() {
  let arrayOfDropdownObjects = [];
  document.querySelectorAll('#all_attributes select').forEach(function (taskFieldHtmlElement) {
    if (taskFieldHtmlElement.previousElementSibling) {

      const id: String = taskFieldHtmlElement.id
      
      let label: String = taskFieldHtmlElement.previousElementSibling.textContent
      if (label) {
        label = label?.replace(" *", "")
      }

      const selectedOptionValue: String = (<HTMLInputElement>taskFieldHtmlElement).value

      const possibleOptionsValues: Array = [...taskFieldHtmlElement].map(el => 
        new Object({
          optionValue: el.value,
          optionText: el.text,
          isSelected: selectedOptionValue === el.value ? true : false
        })
      ); 
      
      const optionObject = {
        id: id,
        label: label,
        value: {
          type: "dropdown",
          options: possibleOptionsValues,
        }
      }

      arrayOfDropdownObjects.push(optionObject)
    }
  })
  return arrayOfDropdownObjects
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'parseRedmineTaskDropdownFieldsToArrayOfObjects') {
    sendResponse({
      data: parseRedmineTaskDropdownFieldsToArrayOfObjects()
    });
  } else if (message.action === 'raiseAlert') {
    console.log('content.js received a message for raiseAlert...')
    alert(`${message.data.text}`);
    sendResponse({
      data: ''
    });
  } 
  return true; // include 'true' otherwise it might close too early.
});

