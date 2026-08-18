# Collecting responses & tracking invitation opens

Everything lands in ONE Google Sheet with three tabs:
- **rsvp** — every RSVP: each guest's name, Yes/No per event, bingo clues, messages
- **pickleball** — team registrations
- **open** — who opened the invitation (link code + name once they sign in)

## Part 1 — Set up the Google Sheet (one time, ~5 min)

1. Go to sheets.google.com → create a blank sheet → name it **Harrison Wedding Responses**.
2. Menu: **Extensions → Apps Script**. Delete the sample code.
3. Open `google-apps-script.gs` from this folder, copy ALL of it, paste it in. Save (💾).
4. Click **Deploy → New deployment**. Click the ⚙ next to "Select type" → **Web app**.
   - Description: anything
   - Execute as: **Me**
   - Who has access: **Anyone**  ← required so the website can post to it
5. Click **Deploy**, approve the permissions (Advanced → Go to project if Google warns — it's your own script), then **copy the Web app URL** (it ends in `/exec`).
6. Open `js/forms.js` in the website folder and paste that URL as `ENDPOINT`:
   ```js
   ENDPOINT: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
7. **Also open `rsvp.html`** and paste the same URL into the identical `ENDPOINT:` line near the bottom (the RSVP page carries its own built-in copy so it can never break).
8. Commit + push. Submit a test RSVP — a row should appear in the sheet within seconds.

To update the script later: edit in Apps Script, then **Deploy → Manage deployments → ✏ edit → Version: New version → Deploy** (the URL stays the same).

## Part 2 — Personalized invitation links (open tracking)

Give every household its own link by adding `?g=` + a short code:

```
https://who0liebo0lie.github.io/v3HarrisonWedding/?g=smith-family
https://who0liebo0lie.github.io/v3HarrisonWedding/?g=aunt-carol
```

- The moment someone opens their link, the **open** tab records the code + time.
- When they type their name on the welcome screen, a second row records the name.
- Their RSVP and pickleball entries carry the same code, so responses match households automatically — exactly what the fine print on the RSVP page promises.

**Build the links fast:** in a sheet, put household names in column A, codes in B
(lowercase-with-dashes), and in C:
`="https://who0liebo0lie.github.io/v3HarrisonWedding/?g="&B2`

## Part 3 — Texting the invitations

**Sample message:**

> 🚢💍 Ahoy! You're invited to Julia & Wesley's Wedding Adventure — a cruise
> celebration aboard Harmony of the Seas, Jan 23–28, 2027!
> All the details, events, and RSVP are on our website — this link is just for
> your household: [paste their link]
> Please RSVP by Sept 7. We can't wait to set sail with you! ⚓

**Tips:**
- **Text each household individually** (not one giant group text) — group MMS
  gets muted, and individual sends are what make per-household links meaningful.
- Keep your invite sheet open on a computer and text from your phone down the
  list — 50 households takes about half an hour of copy-paste.
- iPhone and Google Messages both support **scheduled send** (press-and-hold
  the send button) if you want them all to land at, say, 10 AM Saturday.
- Expect a few "is this spam?" replies to link texts — sending from your own
  number (not a bulk-SMS service) keeps trust high and avoids carrier filtering.
- The **open** tab shows who never opened their link — after a week, those are
  the people to nudge with a personal follow-up or a phone call.
