/**
 * Harrison Set Sail — response collector
 * Receives RSVP, pickleball, and invitation-open events from the website
 * and writes each one as a row in this spreadsheet.
 *
 * SETUP (one time, ~5 minutes) — see SETUP-RESPONSES.md for screenshots-level detail:
 * 1. Create a Google Sheet named "Harrison Wedding Responses".
 * 2. Extensions → Apps Script. Delete the sample code, paste this whole file.
 * 3. Click Deploy → New deployment → type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Authorize when asked, then copy the Web app URL (ends in /exec).
 * 5. Paste that URL as ENDPOINT at the top of js/forms.js on the website.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var type = String(data.type || 'other');          // rsvp | pickleball | open
    delete data.type;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(type) || ss.insertSheet(type);

    var flat = flatten_(data);
    flat['Received'] = new Date();

    // keep a header row that grows as new fields appear
    var lastCol = sheet.getLastColumn();
    var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    Object.keys(flat).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k);
      }
    });
    var row = headers.map(function (h) { return flat.hasOwnProperty(h) ? flat[h] : ''; });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function flatten_(obj, prefix, out) {
  out = out || {}; prefix = prefix || '';
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    if (v && typeof v === 'object') flatten_(v, prefix + k + ' — ', out);
    else out[prefix + k] = v;
  });
  return out;
}
