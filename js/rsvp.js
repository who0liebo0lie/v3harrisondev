(() => {
  const EVENTS = [
    ['welcomeParty', '🌺', 'Welcome Party'],
    ['bingo',        'Ⓑ', 'Bingo'],
    ['wedding',      '💍', 'Wedding']
  ];
  const guestsWrap = document.querySelector('#guests');
  const countSel   = document.querySelector('#guest-count');
  const form       = document.querySelector('#rsvp-form');
  const status     = document.querySelector('#rsvp-status');

  function guestBlock(i){
    const el = document.createElement('section');
    el.className = 'guest-card';
    el.dataset.guest = i;
    el.innerHTML = `
      <span class="guest-tag">GUEST ${i}</span>
      <div class="guest-names">
        <label>First name<input name="g${i}-first" ${i===1?'required':''} autocomplete="given-name"></label>
        <label>Last name<input name="g${i}-last" autocomplete="family-name"></label>
      </div>
      <p class="guest-events-title">PLEASE RSVP TO EACH EVENT</p>
      <div class="event-grid">
        ${EVENTS.map(([key, ico, name]) => `
          <div class="event-cell" data-event="${key}">
            <div class="ev-name"><span class="ev-ico">${ico}</span>${name}</div>
            <button type="button" class="ev-btn yes">Yes, I'm in!</button>
            <button type="button" class="ev-btn no">No, can't make it</button>
          </div>`).join('')}
      </div>
      <div class="bingo-clue">
        <h3>YOUR BINGO CLUE</h3>
        <p>Share one surprising or fun fact about yourself.</p>
        <textarea name="g${i}-bingo" rows="3"></textarea>
      </div>`;
    el.querySelectorAll('.event-cell').forEach(cell => {
      const yes = cell.querySelector('.yes'), no = cell.querySelector('.no');
      yes.addEventListener('click', () => { yes.classList.add('on'); no.classList.remove('on'); });
      no.addEventListener('click',  () => { no.classList.add('on');  yes.classList.remove('on'); });
    });
    return el;
  }

  function render(n){
    const saved = new Map();
    guestsWrap.querySelectorAll('.guest-card').forEach(c => saved.set(c.dataset.guest, c));
    guestsWrap.innerHTML = '';
    for (let i = 1; i <= n; i++) guestsWrap.appendChild(saved.get(String(i)) || guestBlock(i));
  }
  countSel.addEventListener('change', () => render(+countSel.value));
  render(+countSel.value);

  /* pre-fill guest 1 from the welcome gate */
  const stored = (localStorage.getItem('weddingGuestName') || '').trim();
  if (stored) {
    const parts = stored.split(/\s+/);
    const f = form.querySelector('[name="g1-first"]'), l = form.querySelector('[name="g1-last"]');
    if (f && !f.value) f.value = parts.shift() || '';
    if (l && !l.value) l.value = parts.join(' ');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {};
    let anyName = false;
    guestsWrap.querySelectorAll('.guest-card').forEach(card => {
      const i = card.dataset.guest;
      const first = card.querySelector(`[name="g${i}-first"]`).value.trim();
      const last  = card.querySelector(`[name="g${i}-last"]`).value.trim();
      if (first || last) anyName = true;
      const g = { Name: `${first} ${last}`.trim() || '(no name given)' };
      g['Bingo clue'] = card.querySelector(`[name="g${i}-bingo"]`).value.trim();
      card.querySelectorAll('.event-cell').forEach(cell => {
        const label = cell.querySelector('.ev-name').textContent.trim();
        const yes = cell.querySelector('.yes').classList.contains('on');
        const no  = cell.querySelector('.no').classList.contains('on');
        g[label] = yes ? "Yes, I'm in!" : no ? "No, can't make it" : '(no answer)';
      });
      data[`Guest ${i}`] = g;
    });
    if (!anyName) { status.textContent = 'Please tell us at least one guest name.'; return; }
    const note = form.querySelector('#rsvp-message').value.trim();
    if (note) data['Message'] = note;
    status.textContent = 'Sending your RSVP…';
    try {
      const how = await sendWeddingForm('Wedding RSVP', data, 'rsvp');
      const anyYes = !!guestsWrap.querySelector('.ev-btn.yes.on');
      if (how !== 'sent') {
        status.textContent = 'Almost there — hit send in the email that just opened.';
      } else if (anyYes) {
        status.textContent = "You're on the guest list! We can't wait to celebrate with you. ⚓";
      } else {
        status.textContent = 'Your RSVP has been received.';
        const dm = document.getElementById('decline-modal');
        if (dm) { dm.hidden = false; document.getElementById('decline-close').onclick = () => dm.hidden = true; }
      }
    } catch (_) {
      status.textContent = 'Hmm, that didn’t go through. Please try again.';
    }
  });
})();
