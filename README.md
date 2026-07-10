# dhevathirajan.github.io — personal site

A static site (plain HTML/CSS/JS, no build tools, no server) with a CV,
GitHub project links, and a markdown-based "Notes" (blog) section.

## Structure

```
index.html        Home page
cv.html            Full CV
blog.html          List of all notes/blog posts
post.html          Renders a single note (reads ?slug=... from the URL)
css/style.css      All styling
js/main.js         Loads posts.json and renders markdown posts
posts/posts.json   Index of all posts — edit this to publish/unpublish
posts/*.md         The actual post content, one markdown file per post
```

## How to publish a new note (do this anytime)

1. Create a new markdown file in `posts/`, e.g. `posts/2026-08-01-solid-state-batteries.md`.
   Start it with a front-matter block (optional but nice to keep for your own records):
   ```
   ---
   title: Some title
   date: 2026-08-01
   ---

   Your content here, in normal markdown.
   ```
2. Open `posts/posts.json` and add one entry at the top (or anywhere — it's sorted by date automatically):
   ```json
   {
     "slug": "solid-state-batteries",
     "title": "Some title",
     "date": "2026-08-01",
     "summary": "One sentence describing the post.",
     "tags": ["battery", "solid-state"],
     "file": "2026-08-01-solid-state-batteries.md"
   }
   ```
3. Commit and push. That's it — no build step, no server. The home page and
   `blog.html` will pick it up automatically, and `post.html?slug=solid-state-batteries`
   will render it.

## How to update your CV / experience

Just edit `cv.html` directly (and the "Current focus" / "Selected publications"
sections in `index.html` if relevant). It's plain HTML — find the section, edit the text.

## How to add GitHub projects

The "On GitHub" section on the home page currently links out to your GitHub
profile. If you'd like specific pinned repos shown as cards instead, that's a
five-minute addition — just ask, or duplicate the `.card` markup in the
"Current focus" section on `index.html` with repo name/description/link.

---

# Hosting — step by step (GitHub Pages, free)

GitHub Pages is a good fit here: it's free, requires no server, and works
directly with this kind of static site. It also puts your site right next to
your GitHub projects.

### 1. Create the repository
1. Go to https://github.com/new
2. Repository name: **`dhev-rk.github.io`** (must be exactly `<your-github-username>.github.io` — this gives you a clean root URL like `https://dhev-rk.github.io/` instead of a `/repo-name/` subpath)
3. Set it to **Public**
4. Don't initialize with a README (we already have one) — click **Create repository**

### 2. Push this site to it
From the folder containing these files, run:
```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/dhev-rk/dhev-rk.github.io.git
git push -u origin main
```
(If you don't have `git` set up locally yet, install it from https://git-scm.com,
then run `git config --global user.name "Your Name"` and
`git config --global user.email "you@example.com"` once.)

### 3. Turn on GitHub Pages
1. In the repo, go to **Settings → Pages**
2. Under "Build and deployment" → **Source**, choose **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)** → **Save**
4. Wait 1–2 minutes. Your site will be live at:
   **https://dhev-rk.github.io/**

### 4. Publishing future updates
Any time you want to update the site (new post, CV edit, etc.):
```bash
git add .
git commit -m "Add new note"
git push
```
GitHub Pages redeploys automatically within a minute or two of every push.

### 5. Optional: custom domain
If you ever buy a domain (e.g. `dhevkannan.com`):
1. Add a file named `CNAME` in the repo root containing just the domain name.
2. At your domain registrar, add a `CNAME` record pointing to `dhev-rk.github.io`
   (or `A` records pointing at GitHub Pages' IPs — GitHub's docs list the current ones).
3. In **Settings → Pages**, enter the custom domain and enable "Enforce HTTPS".

---

# Alternative free hosts (in case you ever want to move)

Because this is a plain static site with no build step, moving off GitHub
Pages later is just a copy-paste — no code changes needed.

- **Netlify** — drag-and-drop the folder at https://app.netlify.com/drop, or connect the GitHub repo for auto-deploys on every push. Free tier is generous.
- **Vercel** — similar to Netlify; import the GitHub repo at https://vercel.com/new.
- **Cloudflare Pages** — connect the repo at https://pages.cloudflare.com; free, fast global CDN.

All three: no config needed since there's no build step — just point them at
the repo root and they'll serve `index.html` directly.
