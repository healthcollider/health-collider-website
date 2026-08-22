# Health Collider website

Static marketing site for Health Collider. Hand-coded HTML + one CSS file, no
build step, no framework. Hosted on GitHub Pages.

Design spec: `infra/claude-slack-bridge/docs/superpowers/specs/2026-08-22-hc-website-design.md`
in the vault.

## Structure

```
index.html            Home
services/index.html    Services (3 anchored blocks + 7-domain grid)
about/index.html       About + founders + community
contact/index.html     Book-a-call form + booking slot
404.html               Not-found
for-companies/         Redirect stub -> /services/  (old Hostinger path)
for-clinicians/        Redirect stub -> /about/     (old Hostinger path)
main.css               The entire design system (one source of truth)
main.js                Mobile nav toggle (the only script)
assets/                Fonts (self-hosted woff2), logo, og-image
sitemap.xml robots.txt CNAME .nojekyll
```

## Design system

One palette (cream `#FAF7F3`, navy `#0D1B34`, steel `#3E5C84`, soft `#E9EDF4`,
one accent `#E8431C`), Playfair Display 800 for display headings + Poppins for
everything else. **Components may not introduce new colours or fonts** - that
rule is what keeps it consistent. Traffic-light green/red appear only in the
seven-domain grid. Matches the HC infographic/carousel identity.

## Local preview

```
python3 -m http.server 8799   # then open http://localhost:8799/
```

## Deploy (GitHub Pages)

1. Create repo `healthcollider/website`, push `main`.
2. Settings -> Pages -> deploy from `main` / root. `CNAME` sets the custom domain.
3. DNS at the registrar: apex A records -> GitHub Pages IPs
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153);
   `www` CNAME -> `healthcollider.github.io`. Leave MX/TXT untouched.
4. Enable "Enforce HTTPS" once the cert issues.

## Before launch - two wiring items

- **Contact form** (`contact/index.html`): the form posts to FormSubmit as a
  no-backend default; confirm the one-time activation email to
  `contact@healthcollider.com`. Or swap for a Google Calendar appointment embed.
- **OG image**: regenerate `assets/og-image.png` if the headline changes
  (render `assets/`-relative HTML at 1200x630).

## Editing

Copy edits are plain HTML. The bot can edit via the same commit-and-review flow
as the vault (human-approved, never auto-published).
