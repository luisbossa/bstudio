# Portfolio-MVC

A personal portfolio developed with Node.js and deployed on Vercel highlights my skills and projects in a sleek, modern interface. Every text, image, video and colour can be edited from a built-in dashboard.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `EMAIL_USER`, `EMAIL_PASS` | for the contact form | Gmail account and app password |
| `ADMIN_PASSWORD` | for the dashboard | Password for `/dashboard` (the panel is disabled without it) |
| `SESSION_SECRET` | optional | Signs the login cookie |
| `MONGODB_URI`, `MONGODB_DB` | on Vercel | Where content and uploads are stored in production |

## Dashboard

Open `/dashboard`, log in with `ADMIN_PASSWORD` and edit any section. Changes show up in the live preview immediately and are published when you press **Save** (or `Ctrl + S`).

- **Without `MONGODB_URI`** (local): content is saved to `data/content.json` and uploads to `public/uploads/`.
- **With `MONGODB_URI`** (production): content and uploads are stored in MongoDB (uploads in GridFS, served from `/media/:id`).

Vercel's filesystem is read-only, so set `MONGODB_URI` there (a free MongoDB Atlas cluster works). Vercel also limits request bodies to about 4.5 MB, so larger videos must be added as files in `public/videos` or hosted elsewhere and linked by URL.

**Restore original content** (in the `⋯` menu) deletes the saved copy and goes back to `data/default-content.js`.

## Project structure

```
index.js                  Express entry point (used by Vercel)
config/mailer.js          Nodemailer transport
controllers/              Home, contact form and dashboard handlers
middlewares/auth.js       Dashboard login (signed cookie, rate-limited)
routes/index.js           All routes, including /api/content and /api/upload
services/                 Content and media storage (JSON file or MongoDB)
data/default-content.js   Default page content and schema for saved content
utils/                    Icons, view helpers and content sanitizing
views/
  pages/                  home, dashboard, login
  partials/               Shared pieces (head, header, footer, marquee)
  sections/               One file per home page section
public/
  css/                    style.css (site), dashboard.css (panel)
  scripts/                main.js (site), dashboard.js (panel)
  fonts/ images/ icons/ technologies/ videos/
```
