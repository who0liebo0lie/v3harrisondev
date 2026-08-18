(() => {
  /* Register-as-a-team form */
  const form = document.querySelector('#pb-register-form');
  const status = document.querySelector('#pb-status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const p1 = form.player1.value.trim();
    if (!p1) { status.textContent = 'Please enter at least one name.'; return; }
    const data = {
      "Player 1": p1,
      "Player 2": form.player2.value.trim() || "(needs a partner — pair me up!)",
      "Team name": form.teamName.value.trim() || "(to be decided)"
    };
    status.textContent = 'Sending…';
    try {
      const how = await sendWeddingForm('Pickleball team registration', data, 'pickleball');
      status.textContent = how === 'sent'
        ? 'You’re registered! See you on the court 🏓'
        : 'Almost there — hit send in the email that just opened.';
      if (how === 'sent') form.reset();
    } catch (_) {
      status.textContent = 'Hmm, that didn’t go through. Please try again.';
    }
  });


  /* "Pair me up" = solo mode: only one name field */
  const p2label = document.querySelector('#pb-p2-label');
  const sub = document.querySelector('.pb-sub');
  function setSolo(on){
    p2label.hidden = on;
    sub.textContent = on
      ? "Flying solo? Perfect — give us your name and we'll pair you up with a partner!"
      : "You + your partner = one amazing team. Flying solo? One name is all we need — we'll pair you up!";
    document.querySelector('#pb-register-form').scrollIntoView({behavior:'smooth', block:'center'});
  }
  document.querySelector('#pb-pair-up').addEventListener('click', () => setSolo(true));
  document.querySelector('#pb-team-up').addEventListener('click', () => setSolo(false));

})();
