/**
 * Copies the selected data range from 'Table templates' sheet,
 * to a specified official project sheet.
 * @param {string} sheetName - example value 'ISAC_ACQ'
 * @param {string} templateRowRange - example value '83:127'
 * @returns undefined
 */
const copyTableFromTemplatesToOfficial = (sheetName, templateRowRange) => {
  // Calculate rows to insert (from template size)
  const templateRowRangeArray = templateRowRange.split(":");
  const rowCountToInsert =
    templateRowRangeArray[1] - templateRowRangeArray[0] + 1; // 1 is row gap between tables

  // Select spreadsheet/sheet
  let spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName(sheetName), true);

  // Insert empty rows
  spreadsheet.getActiveSheet().insertRowsBefore(1, rowCountToInsert);

  // Copy-paste styles and values from 'Table templates' to the selected official project sheet
  let topLeftCornerRange = spreadsheet
    .getActiveSheet()
    .getRange(`${sheetName}!1:1`);
  spreadsheet.getActiveSheet().setActiveRange(topLeftCornerRange);
  spreadsheet
    .getRange(`Table templates!${templateRowRange}`)
    .copyTo(
      spreadsheet.getActiveRange(),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );
  spreadsheet
    .getRange(`Table templates!${templateRowRange}`)
    .copyTo(
      spreadsheet.getActiveRange(),
      SpreadsheetApp.CopyPasteType.PASTE_VALUES,
      false
    );
};

const ISAC_ACQ = () => {
  copyTableFromTemplatesToOfficial("ISAC_ACQ", "83:127");
};

const GTW = () => {
  copyTableFromTemplatesToOfficial("GTW", "56:80");
};

const ISAC_POS = () => {
  copyTableFromTemplatesToOfficial("ISAC_POS", "130:152");
};

const ISAC_ISS = () => {
  copyTableFromTemplatesToOfficial("ISAC_ISS", "20:53");
};

const WAL = () => {
  copyTableFromTemplatesToOfficial("WAL", "155:180");
};

const BANK_CONNECT = () => {
  copyTableFromTemplatesToOfficial("BANK_CONNECT", "214:234");
};

const WAL_MOB = () => {
  copyTableFromTemplatesToOfficial("WAL_MOB", "183:211");
};

const OPEN_BANKING = () => {
  copyTableFromTemplatesToOfficial("OPEN_BANKING", "237:256");
};

const RISK_MONITOR = () => {
  copyTableFromTemplatesToOfficial("RISK_MONITOR", "259:280");
};

const BILL = () => {
  copyTableFromTemplatesToOfficial("BILL", "283:297");
};
