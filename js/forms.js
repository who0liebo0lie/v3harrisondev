/* ============================================================
   ONE PLACE TO CONFIGURE WHERE RESPONSES GO
   ============================================================
   Option A (recommended, free, unlimited): Google Sheet
     Follow SETUP-RESPONSES.md, then paste your Apps Script
     Web-app URL below (it ends in /exec).
   Option B: leave ENDPOINT empty and set EMAIL — submitting
     opens the guest's email app with answers pre-filled.     */
window.WEDDING_FORMS = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbxVf1ZDeSEh_ztoROJPpk6vu4GM1yVqFbLHAfWf9PSdr5CPomlBOaf2r0D9dfgJoxn3/exec",
  EMAIL: "harrisonssetsail@gmail.com"
};

/* Which invitation link was used (?g=smith-family) — remembered
   so RSVPs can be matched to the right household. */
(function () {
  try {
    var g = new URLSearchParams(location.search).get('g');
    if (g) localStorage.setItem('weddingInviteCode', g);
  } catch (_) {}
})();
function inviteCode() {
  try { return localStorage.getItem('weddingInviteCode') || ''; } catch (_) { return ''; }
}

/* Fire-and-forget event (invitation opens). Never throws. */
function trackWeddingEvent(data) {
  var cfg = window.WEDDING_FORMS;
  if (!cfg.ENDPOINT) return;
  data['Invite code'] = data['Invite code'] || inviteCode();
  data['Page'] = location.pathname.split('/').pop() || 'index.html';
  try {
    fetch(cfg.ENDPOINT, { method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(data) });
  } catch (_) {}
}

/* Form submissions (RSVP, pickleball). */
async function sendWeddingForm(subject, data, type) {
  var cfg = window.WEDDING_FORMS;
  data = Object.assign({ type: type || 'other', 'Invite code': inviteCode() }, data);
  if (cfg.ENDPOINT) {
    /* text/plain + no-cors avoids CORS preflight; Apps Script receives it fine. */
    await fetch(cfg.ENDPOINT, { method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(data) });
    return 'sent';
  }
  var lines = [];
  (function flat(obj, p) {
    for (var k in obj) {
      var v = obj[k];
      if (v && typeof v === 'object') flat(v, p + k + ' ');
      else lines.push(p + k + ': ' + v);
    }
  })(data, '');
  location.href = 'mailto:' + cfg.EMAIL + '?subject=' + encodeURIComponent(subject) +
                  '&body=' + encodeURIComponent(lines.join('\n'));
  return 'mailto';
}
