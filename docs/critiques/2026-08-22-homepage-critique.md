# Health Collider homepage - UI/UX critique

Date: 2026-08-22
Target: http://localhost:8799 (source: `~/Projects/health-collider-website`, commit 5da44a8)
Passes run: 1 (visual), 2 (interaction, partial), 3 (code-informed)

Not assessed: below-fold visual scan at desktop width. The browser pane returned stale
composited frames on every scrolled capture, so desktop findings below the hero come from
source, computed styles and measured values rather than pixels. Mobile rendering was
captured successfully.

## Status (2026-08-22, same day)

| ID | Finding | Status | Verified by |
|----|---------|--------|-------------|
| C1 | Orange CTAs at 4.00:1 | **Fixed** | all 4 primary buttons + card links now measure 5.10:1 |
| C2 | Nav CTA painted navy | **Fixed** | forced by C1 - darkening the background would have driven it to 3.33:1 |
| C3 | Newsletter form leaked email, subscribed nobody | **Fixed** | now POSTs to formsubmit.co, honeypot, no query string |
| C4 | Mobile nav dead without JS | **Fixed** | verified in all 3 states (JS closed / JS open / JS off) |
| S1-S5, N1-N4 | - | Open | - |

`--accent: #E8431C` is retained for the two non-text uses only (trust-strip dot, focus-ring
border). Both clear the 3:1 non-text threshold at 4.00:1. If a single brand orange is
preferred, set `--accent: #C93B14` and delete `--accent-strong`.

---

## Verdict

The build quality is high and the copy is sharp, but the page sells a trust-led clinician
consultancy while showing no human faces and leaving 55% of the first screen empty. It
reads as a competent template rather than as three named NHS doctors you would ring.

---

## Critical

### C1. Every orange CTA fails WCAG AA contrast
**What:** White on `--accent: #E8431C` measures **4.00:1**. Normal-weight text at 15px needs
4.5:1. This hits the primary "Book an intro call" button in the hero, the CTA band, the
newsletter button, and all three `.card-link` items.
**Why:** The single most important element on a lead-gen page is below the legal
accessibility floor. Under bright light or on a poor screen it degrades first.
**Fix:** Split the token. Keep `#E8431C` for large display use; introduce
`--accent-strong: #C93B14` (measures 5.10:1 with white) for anything text-bearing.
`main.css:25`.

### C2. The nav CTA renders the wrong colour
**What:** The header "Book an intro call" computes to navy `rgb(13,27,52)` on orange
(**4.29:1**). Every other `.btn-primary` on the page is white. Cause is specificity:
`.nav-links a` (0,1,1) at `main.css:96` beats `.btn-primary` (0,1,0) at `main.css:83`.
**Why:** The most persistent CTA on the site looks different from all the others, and it
flips to white on hover, which reads as a rendering fault. The existing
`.btn-primary:hover { color:#fff }` is a workaround for this bug rather than a hover style.
**Fix:** `.nav-links a.btn { color: var(--accent-ink); }`.

### C3. The newsletter form does not subscribe anyone
**What:** `<form action="/contact/" method="get">` at `index.html:231`. Submitting appends
`?email=...` to the URL and lands the user on the contact page.
**Why:** Two failures at once. No signup is recorded, so every subscriber is silently lost;
and the email address is written into the URL, browser history, and any server or proxy log
in the path.
**Fix:** Point it at a real ESP endpoint with a confirmation state, or remove the section
until one exists. Never `method="get"` for an email field.

### C4. Mobile navigation is dead with JavaScript off
**What:** `main.css:219` sets `.nav-links { display: none }` below 860px; only `.open`
reveals it, and only `main.js` adds that class. The comment at the top of `main.js` claims
"with JS off the links are simply always visible... on small screens the nav still renders
as a stacked list" - that is not what the CSS does.
**Why:** Any mobile visitor without JS has no navigation at all. The misleading comment means
the next person to touch this will trust it.
**Fix:** Use a `<details>` element or checkbox-hack toggle so it works without JS, or default
`.nav-links` to visible and have JS collapse it on load. Correct the comment either way.

---

## Significant

### S1. The hero wastes over half the viewport
**What:** At 1280px the hero is 592px tall inside a 1120px container, but `h1` is capped at
`15ch` and `.lead` at `44ch` (`main.css:105-106`), so content occupies roughly 440px. The
right 55% is empty cream.
**Why:** The most valuable screen real estate on the site carries no work. Nothing
demonstrates the product, the people, or the problem.
**Fix:** Put something in the right column - founder photography, or a small diagram of the
three-situations model that already exists further down. If nothing is ready, centre the
column and cut the hero height by a third.

### S2. No faces anywhere
**What:** Founders appear as initials in circles (JH / VG / AS).
**Why:** The entire differentiator is "practising NHS clinicians... from the buyer's side of
the table". A buyer deciding whether to give up 30 minutes is deciding about people, and the
page shows none. This is the highest-leverage single asset the site is missing.
**Fix:** Three headshots. Same three images solve S1's empty hero.

### S3. Social proof is one quote
**What:** A single testimonial (Taha, Mindbay.ai). No logos, no engagement counts, no
outcome numbers.
**Why:** One quote reads as "we found someone willing". For a consultancy asking for a call,
it is the thinnest section on the page.
**Fix:** Two more quotes, or a client logo strip. If NDAs block names, use sector
attributions ("a CQC tooling vendor, Series A").

### S4. The H1 restates the eyebrow
**What:** "NHS MARKET ACCESS CONSULTANCY" sits directly above "Market access for health-tech
in the NHS."
**Why:** The same words twice in the two most prominent slots. The `.lead` underneath does
all the actual persuading, which means the largest type on the page is the least useful.
**Fix:** Promote the real claim. "The NHS adopts by evolution, not revolution" is the
sharpest line on the page and it is buried in section four.

### S5. "Learn more →" three times
**What:** Identical, non-descriptive link text across the three service cards.
**Why:** Screen-reader users pulling a link list get three indistinguishable entries, and the
anchor text carries no keyword signal for a site that otherwise takes SEO seriously.
**Fix:** "See the consultancy session", "See the retainer", "See the assessment".

---

## Nitpicks

- **N1.** Hero `.lead` measures 4.46:1 (`--muted #64748B` on cream, 21px/400). 21px normal
  weight is not "large text" under WCAG, so it needs 4.5. Misses by 0.04. Darken `--muted`
  one step.
- **N2.** `.card-link` is 4.00:1 - same root cause as C1, fixed by the same token split.
- **N3.** `.nav-links { inset: 61px 0 auto 0 }` (`main.css:219`) hardcodes the header height.
  A one-pixel change to nav padding misaligns the mobile drawer. Use `top: 100%` on a
  positioned header.
- **N4.** Nav links compute to 24px tall - exactly the WCAG 2.2 minimum target size, with no
  margin. Padding to 44px costs nothing at desktop.

---

## What works

- **Colour discipline.** The 60/30/10 cream/navy/accent split is declared in `:root` and
  actually held to throughout. Rare.
- **Mobile.** Genuinely good. Cards stack cleanly, type stays large, spacing stays generous.
  Better than the desktop hero.
- **Technical SEO.** Canonical, OG image present on disk, JSON-LD `@graph` with named
  founders, sitemap, robots, skip link, and real 301-intent stubs for the retired
  `/for-clinicians` and `/for-companies` paths. Thorough.
- **Fonts.** Self-hosted woff2 with preload on exactly the two above-fold faces.
- **Copy.** Specific and unhedged. "National rollout stays a fantasy" and "clears the 'who
  are you?' barrier" are real sentences, not consultancy filler.
