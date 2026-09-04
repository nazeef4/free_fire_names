# FFNames.pro — Free Fire Name Generator Website

A complete, ready-to-deploy, fully responsive Free Fire names website.
100% static (HTML + CSS + vanilla JS) — no build step, no server, no dependencies.

## Features

- **Name generator** — type any nickname, instantly explore all **54 unicode styles** (14 fonts: Old English, Cursive, Bubble, Small Caps, Tiny... + 40 decoration frames like ꧁༒•name•༒꧂) in an internal scrollable gallery, with random-name dice, style-family filter, and a live 12-character limit counter.
- **Clan Name Generator** — build stylish gaming clan tags with custom tag styles (`『 』`, `[ ]`, `亗 亗`, `ঔৣ ৣঔ`, `★ ★`, `ˢᵘᵖᵉʳ`, `» «`, `◆ ◆`, `⚡ ⚡`, `࿐`, `丨`, `× ×`, `꧁ ꧂`, `☠ ☠`), optional player names, random squad dice, and live generated combinations in an internal scrollable gallery.
- **868 curated names** across **28 categories** — Stylish, Boys, Girls, Cool, Pro, Attitude, Cute, Funny, Silent, Devil, Angel, Royal, Mythical, One Word, Two Letters, Guild & Clan, Trending, New Year 2026, Legends, Badass, Aesthetic, Lovers, Noob, Alone & Sad, Your-Name styles, Couples, Rare symbols, Viral mix.
- **560+ symbols library** in 21 categories (crowns, stars, brackets, arrows, smileys, hearts, crosses, music, blocks, Greek, accented Latin, currency, nature, chess, kaomoji, tiny letters, numbers, weapons, **blank/invisible characters**, rare letters) with click-to-copy and search.
- **One-tap copy everywhere** with clipboard API + fallback, confirmation toast, character-count badges (warns above the 12-char FF limit).
- **Favorites** — heart any name, manage in a modal, copy-all, persistent via localStorage.
- **Full guide page** — how to change your name, costs (free first rename / Name Change Card / 390 diamonds), 12-character rule, guild rename (500 gold), nickname rules, blank names.
- **14-question FAQ** accordion + matching FAQPage JSON-LD structured data.
- **SEO ready** — unique titles/descriptions, canonical URLs, Open Graph/Twitter cards, sitemap.xml, robots.txt, WebSite JSON-LD.
- **Legal pages** — Privacy Policy, Terms, About/Contact + 404 page.
- **Mobile-first responsive** design with hamburger nav, horizontal-scroll tabs, touch-friendly cards; dark gaming theme; reduced-motion support; security headers via `_headers`.

## Run locally

```bash
cd free_fire_names
python3 -m http.server 8000
# open http://localhost:8000
```

Any other static server works too (`npx serve`, `php -S`, etc.).

## Deploy

Push to GitHub and host on any static host:

- **GitHub Pages** — Settings → Pages → deploy from branch (`main`, root). `.nojekyll` is already included.
- **Netlify** — drag-and-drop the folder or connect the repo. `_headers` (security headers + caching) is picked up automatically.
- **Cloudflare Pages / Vercel** — connect the repo, zero config.

After deploying, update the placeholder domain `ffnames.pro` in `index.html`, `sitemap.xml`, `robots.txt` and the manifest if you use a different domain.

## Structure

```
index.html          Home: hero, generator, names tabs, symbols preview, how-to, FAQ
symbols.html        Full symbols library (560+ symbols, search, quick links)
guide.html          How to change your Free Fire name (steps, costs, rules)
about.html          About, contact, disclaimer
privacy.html        Privacy policy
terms.html          Terms of use
not-found.html      404 page
assets/css/         Single stylesheet (dark gaming theme, responsive)
assets/js/
  data.js           Fonts, decorations, collections (868 names) — pure data
  symbols-data.js   Symbol groups (560+) + FAQs — codepoint-built
  app.js            Generator, tabs, favorites, copy, nav (all pages)
  symbols-page.js   Symbols page behaviour (search, quick links)
sitemap.xml robots.txt _headers site.webmanifest .nojekyll
```

## Notes

- All non-ASCII symbol data is built from numeric unicode codepoints, keeping it copy-safe and garbage-free.
- Fan-made tool; not affiliated with Garena. Keep the disclaimer in the footer.
- Rename facts (390 diamonds / Name Change Card / 12-char limit / 500 gold guild rename) reflect Free Fire as of 2026.
