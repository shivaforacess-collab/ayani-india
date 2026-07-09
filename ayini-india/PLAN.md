# AYINI India — Build Plan (Step 1 output)

## Folder structure (created)
```
ayini-india/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   │   ├── logo/
│   │   ├── gallery/
│   │   ├── clients/
│   │   └── team/
│   ├── icons/
│   └── fonts/
├── pages/
│   └── services/        (one file per service, per brief)
├── blog/
├── gallery/
├── resources/
├── favicon/
├── robots.txt
├── sitemap.xml
├── manifest.json
└── index.html            (added in Step 2)
```

## Design token system (for your review before Step 2 — Home page)

**Color** — following the brief's palette exactly (bright, no dark backgrounds):
- `--navy-900: #0B2A4A` — primary text / header
- `--royal-600: #14539A` — primary actions, links
- `--white: #FFFFFF`
- `--grey-100: #F4F6F8` — section backgrounds
- `--gold-500: #E8A93A` — accent, stat highlights, hover states
- `--orange-400: #F0824D` — secondary accent, CTA highlight

**Type** — per brief: Calibri, fallback Arial, sans-serif, for the entire site.
To carry personality within that constraint, I'll lean on a strong scale (72/48/32/20/16px), wide letter-spacing on eyebrows/labels, and weight contrast (Bold 700 headlines vs Regular 400 body) rather than a second typeface — since the brief locks the family, distinctiveness has to come from scale, rhythm and spacing.

**Layout concept:**
- Wide, airy 12-col grid, generous vertical rhythm (120px+ section padding desktop)
- Sticky header that compresses on scroll
- Justified body copy per brief
- Cards: soft shadow, 12px radius, light glassmorphism only on hero overlay elements

**Signature element:** A "Compliance Thread" — a thin animated navy/gold line that runs down the left margin of process/timeline sections (Objective, Compliance Process, Timeline) and visibly connects each step, echoing the brand's role as the connective thread between food businesses and safety standards ("let's reap together"). This replaces generic numbered-circle timelines with something tied to what AYINI actually does.

**Motion:** One orchestrated hero load-in (logo mark draws in, headline fades up, CTA settles) + scroll-reveal on section entry + the compliance-thread line-draw animation. Kept restrained elsewhere — hover lifts on cards, no gratuitous parallax everywhere.

## Content sources mapped
- Company Profile PDF → About page (Who We Are, Mission/Vision, Quality Policy, Core Values, Strengths, Objective, 3 Arms, full Service Offerings, Stakeholders, Org Structure, Sectors Served, Clientele)
- Corporate Statement PDF → Home page "Why We Exist" narrative + About page context
- Contact: NO.14, Innov8, 5th Floor, South Phase, SIDCO Industrial Estate, Guindy, Chennai 600032 | +91 9790809998 | info@ayiniindia.com
- Social: LinkedIn + Instagram links (footer)

## Next step
Step 2: Build Home page (index.html + assets/css/style.css + assets/js/main.js) using this token system.
