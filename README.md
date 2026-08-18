# Harrison Set Sail — Wedding Website (v23)

Static site: open `index.html` (or host the folder on GitHub Pages / Netlify).

## What changed in v22
- **Welcome sign-in** redesigned: new wording, Wesley (left) asks first name / Julia (right) asks last name in speech bubbles, "That's me!" ⚓ button, floral corners. **No sound, no slow intro** — the landing page loads immediately after sign-in (or with `index.html?skip=1`).
- **Landing page**: single white-font header (Home hidden on home page); baked-in RSVP bubble removed from the artwork (`landing-page-clean.png`).
- **Our Story**: rebuilt as a real page — chat bubbles use Julia & Wesley's portraits, the English translation was removed from Julia's bubble, and the story text was updated. No blue border; content fills the page.
- **All pages**: full-width, no blue border.
- **Pickleball**: working "Register as a team" form (one name is enough), sends to Julia & Wes (see below); FAQ row is clickable with answers.
- **CocoCay**: countdown removed from the footer artwork (`cococay-clean.png`).
- **Explore**: "View all venues in Central Park" button removed from artwork (`explore-clean.png`); the six tiles (Dining, Drinks, Relaxation, Entertainment, Evenings, Explore) link to Royal Caribbean's Harmony of the Seas pages.
- **Travel & Booking**: ship photo removed — replaced with a styled title band; FAQs still clickable.
- **RSVP**: fully functional — guest count selector, per-guest Yes/No for Welcome Party, Bingo, Pickleball, and Wedding, bingo clue per guest, optional message, and the "Your presence is the present" Zelle note.

## ⚠️ Receiving RSVP + Pickleball submissions — see SETUP-RESPONSES.md (Google Sheet, free, recommended)
Edit **`js/forms.js`** (top of the file):
1. **Best:** create a free form at [formspree.io](https://formspree.io), paste its URL into `ENDPOINT`. Submissions then arrive in your inbox/dashboard automatically.
2. **Or** leave `ENDPOINT` empty and set `EMAIL` to your address — submitting opens the guest's email app with the answers pre-filled (they must press send).

## v23 fixes
- Welcome sign-in fully rebuilt to match the approved mock: gold-framed cream card, Playfair/Great Vibes fonts, cut-out photos of Wesley (left) and Julia (right), script speech bubbles pointing to the FIRST NAME / LAST NAME fields, "THAT'S ME!" button, dashed "We're so excited that you're here!" footer, and an X to close.
- The sign-in script is now **inline in index.html** — it cannot break if a JS file is missing, and the X button always lets guests through.
- New transparent floral corner art (`assets/florals/`) replaces the old corner images that had a navy border baked in (this is what caused the blocky rectangles).

## ⚠️ When deploying to GitHub Pages
Upload **the entire folder** — including `css/`, `js/`, `assets/approved/`, `assets/florals/`, `assets/portraits/`, and `assets/neighborhoods/`. If `js/` or `assets/` files are missing on the server, forms and images will silently break.
