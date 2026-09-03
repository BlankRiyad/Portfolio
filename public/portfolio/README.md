# MD. RIYAD HASAN — Portfolio Website

A clean, modern, single-page portfolio website built with **pure HTML, CSS, and
vanilla JavaScript** — no frameworks, no build tools, no backend.

Designed to deploy for free on **Cloudflare Pages**.

---

## What's inside

```
/
├── index.html              # Main portfolio (single page)
├── cv.html                 # In-site PDF viewer for the CV
├── css/
│   └── style.css           # All styles (warm cream palette)
├── js/
│   └── main.js             # Navigation, modal, animations
├── assets/
│   └── logo.png            # Logo / emblem
├── certificates/
│   └── placeholder.svg    # Placeholder used by the certificate modal
├── Riyad_CV.pdf            # The CV (opens inside cv.html)
└── README.md               # This file
```

### Features

- **Sticky navigation** with smooth scrolling + mobile hamburger menu
- **Hero** with name, title, tagline and quick contact info
- **About / Professional Summary**
- **Experience** as a vertical timeline
- **Education** as hover cards with GPA highlights
- **Skills** grouped into Technical, Languages (with proficiency bars) and Research & Writing
- **Projects** — 4 ready-to-replace placeholder cards with clear HTML comments on how to add more
- **Professional Development & Certifications** — every item opens a **modal / lightbox** showing title, organization, year, description and the certificate file (image or PDF)
- **References** — two professor cards with email links
- **Contact** footer with email, phone, location and CV link
- **CV PDF** opens inside the website on `cv.html` (no forced download)
- Fully **responsive**, **accessible** (semantic HTML, focus states, ARIA, reduced-motion support) and **fast**

---

## Deploy to Cloudflare Pages (Free)

### Option A — Upload the folder directly

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Give your project a name (e.g. `riyad-portfolio`).
3. **Drag and drop the entire contents of this folder** (all files above, including
   `index.html`, `cv.html`, `css/`, `js/`, `assets/`, `certificates/`, `Riyad_CV.pdf`).
4. Click **Deploy site**.
5. Your site is live at `https://<project-name>.pages.dev` 🎉

### Option B — Connect a Git repository

1. Push this folder to a GitHub/GitLab repository.
2. In Cloudflare Pages → **Create a project** → **Connect to Git**.
3. Select the repository.
4. Build settings:
   - **Framework preset:** `None`
   - **Build command:** _(leave empty)_
   - **Build output directory:** `/` (the project root)
5. Click **Save and Deploy**.

> No build step is needed — this is a 100% static site.

---

## Customizing

### Add a new project card

Open `index.html`, find the `<!-- End of project cards. Add more above this comment. -->`
line inside the Projects section and copy an existing `<article class="project-card …">`
block. Full instructions are in the HTML comments there.

### Add a real certificate image / PDF

1. Drop your file into the `certificates/` folder, e.g. `certificates/python-cert.pdf`.
2. In `index.html`, find the relevant `cert-card` button and update its
   `data-cert-file` attribute to `certificates/python-cert.pdf`.
3. The modal automatically shows images inline and embeds PDFs.

### Replace the CV

Replace `Riyad_CV.pdf` with an updated version (keep the same filename) or
update the `data`/`src` attributes in `cv.html` and the hero/footer links.

### Change the logo

Replace `assets/logo.png` with your own image (keep the same filename, or update
the `<img src="…">` references in `index.html` and `cv.html`).

---

## Tech notes

- **Fonts:** Google Fonts (Plus Jakarta Sans + Fraunces) via CDN.
- **Icons:** Lucide via CDN.
- **No build tools. No npm. No frameworks.** Just open `index.html` in a browser
  or upload to any static host.

© MD. RIYAD HASAN. All rights reserved.
