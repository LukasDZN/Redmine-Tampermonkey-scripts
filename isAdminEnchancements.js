// ==UserScript==
// @name         IS-ADMIN
// @version      0.1
// @description  IS-ADMIN design change test
// @author       ld
// @match        https://is-admin.isaac-sandbox.tribepayments.com/*
// @match        https://is-admin.isaac.tribepayments.com/*
// @match        https://is-admin.isaac-etoro.tribepayments.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribepayments.com
// @grant        GM_addStyle
// ==/UserScript==

(function () {
	'use strict';

	GM_addStyle(`


span.select2-dropdown.select2-dropdown--below {
    width: max-content!important;
}


`);

	console.log('Tampermonkey script is running on this page...');
})();

// Admin URL to preview the effect: https://is-admin.isaac-sandbox.tribepayments.com/program-manager/22/actual-authorizes?id=&deProcCode=&cardsId=&deTxnDateTime=&deTxnAmount=&deTxnCurrencyIson=&deCountryIson=&deMcc=&transactionTypesId=&entryModeTypesId=&isRejected=&suspicious=&settled=&dateCreatedFrom=2021-11-02+00%3A00%3A00&dateCreatedTo=2022-04-04+00%3A00%3A00&transLink=
function openHrefOnDivClick() {
	// Identify rows (tr)
	const rowNodeList = document.querySelectorAll(
		'div.table-responsive.fixed-scrollbar-container > table > tbody > tr'
	);
	if (rowNodeList.length === 0) {
		return;
	}
	// Styling
	GM_addStyle(`

        tbody tr:hover {
            background-color: #f9e7ff!important;
            cursor: pointer;
        }

    `);
	// Parse row, find href, apply href as onlick div action
	rowNodeList.forEach(trElement => {
		const elementHref = trElement.lastElementChild
			.getElementsByTagName('a')
			.item(0).href;
		trElement.addEventListener('click', () => {
			window.location.href = elementHref;
		});
	});
	console.log('openDivRowAuthorization was run...');
}
// openHrefOnDivClick();

function stickyRightColumn() {
	// Identify rows (tr)
	const rowNodeList = document.querySelectorAll(
		'div.table-responsive.fixed-scrollbar-container > table > tbody > tr'
	);
	if (rowNodeList.length === 0) {
		return;
	}
	// Styling
	GM_addStyle(`

        div.table-responsive.fixed-scrollbar-container > table > thead th:last-child, div.table-responsive.fixed-scrollbar-container > table > tbody td:last-child {
            position: sticky;
            right: 0;
            background-color: #fff;
            padding-left: 16px!important;
            margin-left: 16px;
        }

        /* "Eye" button size */
        /*
        a.btn.btn-sm.btn-outline-primary {
            scale: 1.2;
        }
        */

    `);
	console.log('stickyRightColumn was run...');
}
stickyRightColumn();
