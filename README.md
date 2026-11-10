# 🎬 Video Editor Portfolio — Complete Beginner Guide

A clean, minimal, fully responsive portfolio website for a video editor.
**Front-end only** (just HTML, CSS and JavaScript — no backend, no database, nothing to install to *run* it).
Your videos are **uploaded with the website itself** (in the `assets/videos/` folder) and play in a pop-up. No YouTube needed (a YouTube link still works too, if you ever want one for a long video).

**What makes it unique**
- A video-editor **timeline bar** at the top whose playhead moves as you scroll
- A floating **timecode counter** (`00:01:24:12`) and "Scene" label, like an editing app
- **Film-frame corner marks** on videos when you hover
- Smooth scroll animations: headline line-reveal, staggered fade-ups, showreel zoom, counting numbers, a "filling" process line, and a scrolling tools strip
- A **"PLAY" cursor** on desktop, light/dark theme switch, and category filters for your videos

---

## 1. Folder structure

```
video-portfolio/
├── index.html               ← The page structure and your text (headlines, About, Services…)
├── css/
│   └── style.css            ← All colours, fonts, spacing, animations
├── js/
│   ├── config.js            ← ⭐ YOUR CONTENT: name, email, socials, video list, numbers
│   └── main.js              ← The behaviour (animations, video pop-up, menu). You rarely edit this
├── assets/
│   ├── favicon.svg          ← The small icon in the browser tab
│   ├── images/
│   │   └── profile-placeholder.svg   ← Replace with your own photo
│   └── videos/              ← ⭐ PUT YOUR VIDEO FILES (.mp4) HERE
├── .gitignore               ← Tells Git which files NOT to upload (you can ignore this file)
└── README.md                ← This guide
```

**The golden rule — where do I change things?**

| I want to change…                                   | Open this file          |
|-----------------------------------------------------|-------------------------|
| My name, email, social links, location              | `js/config.js`          |
| Video titles, categories, which video file to use  | `js/config.js`          |
| The showreel file                                   | `js/config.js`          |
| My video files (.mp4) and thumbnails                | `assets/videos/`, `assets/images/` |
| The numbers (150+ videos…), software list           | `js/config.js`          |
| Headline, About paragraphs, Services, Process steps | `index.html`            |
| My photo                                            | `assets/images/`        |
| Colours, fonts, spacing                             | `css/style.css` (top)   |

---

## 2. Install what you need (one time only)

You do **not** need Node.js, npm, or any build tools. You need three things:

1. **VS Code** (the editor) → https://code.visualstudio.com → download and install.
2. **Git** (sends your code to GitHub) → https://git-scm.com/downloads → install with all the default options.
   - Check it worked: open VS Code → menu **Terminal → New Terminal** → type `git --version` and press Enter. You should see a version number.
3. Two free accounts:
   - **GitHub** → https://github.com (Sign up)
   - **Vercel** → https://vercel.com (Sign up → choose **Continue with GitHub**)

---

## 3. Set up the project in VS Code

1. Unzip the downloaded `video-portfolio.zip`. Put the **`video-portfolio`** folder somewhere easy (e.g. `Documents`).
2. Open VS Code → **File → Open Folder…** → choose the `video-portfolio` folder → **Select Folder** (click "Yes, I trust the authors" if asked).
3. On the left (**Explorer** panel) you'll see all the files from the folder structure above. Click a file to open it.
4. Install helpful extensions — click the **Extensions** icon (four squares, left bar) and search for:
   - **Live Server** (by Ritwick Dey) → click **Install**. *Required for step 4 below.*
   - **Prettier – Code formatter** *(optional, keeps code tidy)*.

---

## 4. Run the website on your computer

**Use Live Server (don't just double-click `index.html`)** — it is the most reliable way to preview, and it matches how the site behaves online.

1. In VS Code, open `index.html`.
2. Click **Go Live** at the bottom-right of the window (or right-click inside `index.html` → **Open with Live Server**).
3. Your browser opens at an address like `http://127.0.0.1:5500` — that's your site!
4. Now edit any file and press **Ctrl+S** (Mac: **Cmd+S**). The page **refreshes by itself**.
5. To stop: click **Port: 5500** at the bottom-right.

---

## 5. Add your own videos (uploaded with the website)

### Step A — Prepare the video file (IMPORTANT: make it small)
Raw exports from Premiere / DaVinci / CapCut are usually **huge** (hundreds of MB). A website needs small files, otherwise it loads slowly and GitHub will refuse them.

**Limits to remember**
| Where | Limit |
|-------|-------|
| GitHub (adding files by `git push`) | a single file **over 100 MB is blocked**; over 50 MB gives a warning |
| GitHub (drag-and-drop on the website) | 25 MB per file |
| Vercel free plan | fair-use bandwidth (about 100 GB/month). Big videos viewed by many people use it up faster |

**Our target: each video about 5–25 MB, 30–90 seconds, 720p or 1080p.** This is perfect for a showcase of short cuts, reels and promos.

**Easy way — HandBrake (free, https://handbrake.fr):**
1. Open your video in HandBrake.
2. Preset: **Web → "Creator 720p30"** (or "Fast 1080p30" for sharper quality).
3. Format: **MP4**, and tick **"Web Optimized"** (this makes the video start playing instantly).
4. Click **Start Encode**. Check the result's file size.

**Command-line way (if you have ffmpeg):**
```bash
ffmpeg -i input.mov -c:v libx264 -crf 26 -preset slow -vf scale=-2:1080 -c:a aac -b:a 128k -movflags +faststart my-promo.mp4
```
*(Higher `-crf` number = smaller file, lower quality. Try 24–28.)*

**Name your file** in lowercase with no spaces: `my-promo.mp4` ✅ — `My Promo FINAL.MP4` ❌

### Step B — Put it in the project
Copy the `.mp4` into the **`assets/videos/`** folder (in VS Code you can drag it into the Explorer panel on the left).

### Step C — (Recommended) Add a thumbnail picture
Without one, the site uses the video's first frame (which is sometimes black). A thumbnail loads faster and looks better.
1. Export a nice frame as a **JPG** (in your editor: Export Frame — or with ffmpeg:
   `ffmpeg -i my-promo.mp4 -ss 00:00:02 -frames:v 1 -q:v 3 my-promo.jpg`).
2. Size: 1280×720, under 200 KB.
3. Put it in **`assets/images/`**.

### Step D — Tell the website about it
Open **`js/config.js`** and edit the video's block:

```js
{
  title: "Product launch promo",
  category: "Commercial",
  video: "assets/videos/my-promo.mp4",     // ← path to your video file
  poster: "assets/images/my-promo.jpg",    // ← thumbnail (or "" to use the first frame)
  description: "A launch video with kinetic titles and punchy cuts.",
  length: "1:00",
},
```
Save → the placeholder becomes your video. Hover over it on desktop for a silent preview; click for the full video with sound.

**If a card still says "Placeholder":** the file name or folder in `video:` doesn't match the real file. Check spelling, capital letters, and that the extension (`.mp4`) is right.

### The big showreel (top of the page)
In `js/config.js`:
```js
showreel: "assets/videos/showreel.mp4",
showreelPoster: "assets/images/showreel.jpg",   // optional
```

### Add, remove, reorder videos
- **Add:** copy one whole `{ … },` block and paste it under the last one.
- **Remove:** delete one whole `{ … },` block (and delete the video file too, to keep the project small).
- **Reorder:** cut and paste blocks (first = shown first).
- **Categories:** the filter buttons are created from the `category` words you use. Spell them identically for videos in the same group.
- **Vertical videos (Reels/Shorts, 9:16):** detected automatically — the pop-up becomes tall.

### What if I have long or many videos?
- **Mix it:** the `video:` field also accepts a **YouTube link** — so long videos can stay on YouTube while short ones are uploaded here.
- **Or use a bigger video host later:** services like **Cloudflare R2** or **Bunny.net** give you a direct link ending in `.mp4`. Paste that full `https://…mp4` link in `video:` and it works the same. Ask me and I'll guide you.
- **Total project size:** keep the whole repository under about **500 MB** (GitHub recommends under 1 GB).

---

## 6. Upload the project to GitHub

### Create the (empty) repository
1. Go to https://github.com → click **+** (top-right) → **New repository**.
2. **Repository name:** `video-portfolio` (any name is fine). Keep **Public**.
3. **Do NOT** tick "Add a README", ".gitignore" or license (you already have them).
4. Click **Create repository**. Keep this page open — it shows your repository address, like `https://github.com/YOUR-USERNAME/video-portfolio.git`.

### Send your code (in the VS Code terminal)
Open **Terminal → New Terminal** (it opens inside your project folder) and run these one at a time, pressing Enter after each.

**First time only — tell Git who you are:**
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
(Use the same email as your GitHub account.)

**Upload:**
```bash
git init
git add .
git commit -m "First version of my portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/video-portfolio.git
git push -u origin main
```
- Replace `YOUR-USERNAME` with your real GitHub username.
- On `git push`, a window opens asking you to **sign in to GitHub** in the browser — approve it.
- Refresh your GitHub repository page: your files are there ✅

### Uploading future changes (every time you edit something)
```bash
git add .
git commit -m "Describe what you changed"
git push
```
*(Prefer clicking? In VS Code open the **Source Control** icon (branch symbol), type a message, click **Commit**, then **Sync Changes**.)*

---

## 7. Deploy to Vercel (free `.vercel.app` address)

1. Go to https://vercel.com and log in (**Continue with GitHub**).
2. Click **Add New… → Project**.
3. Under **Import Git Repository**, find **video-portfolio** → **Import**.
   *(If you don't see it, click "Adjust GitHub App Permissions" and allow access to that repository.)*
4. On the configuration screen, set:
   - **Framework Preset:** `Other`
   - **Root Directory:** leave as `./`
   - **Build Command / Output Directory / Install Command:** leave **empty** (this site needs no build)
5. Click **Deploy** and wait ~30 seconds. 🎉
6. You'll get a live address like `https://video-portfolio-abc123.vercel.app`. Click the preview to open it, and send the link to anyone.

**Choose a nicer address:** Project → **Settings → Domains** → edit the default domain to something like `yourname-edits.vercel.app` (if it's free).

**Updating the live site:** just run the 3 Git commands from section 6 (`add`, `commit`, `push`). Vercel automatically re-deploys within a minute. No other steps.

---

## 8. Common changes (cheat sheet)

### Change text
- **Name / email / location / socials / numbers / software:** `js/config.js`.
- **Headline:** in `index.html`, search for `I turn raw footage`. Each `<span class="line">` is one line of the headline.
- **About paragraphs:** search for `id="about"` in `index.html` and edit the `<p>` text.
- **Browser tab title & Google description:** the `<title>` and `<meta name="description">` at the top of `index.html` (also change `og:title` / `og:description`).
- **Hide a social link:** set it to `""` in `config.js`.

### Change images
- **Your photo:** put your image in `assets/images/` (e.g. `me.jpg`, about 800×1000 px, under 300 KB), then in `index.html` change
  `src="assets/images/profile-placeholder.svg"` → `src="assets/images/me.jpg"`.
- **Favicon (tab icon):** replace `assets/favicon.svg`.
- **Video thumbnails:** put a JPG in `assets/images/` and set `poster: "assets/images/name.jpg"` for that video in `config.js`.

### Change colours
Open `css/style.css`. At the very top, section **"1. DESIGN TOKENS"**:
```css
--accent: #ff4d2e;     /* orange-red highlight  → try #3b82f6 (blue) or #a3e635 (lime) */
--bg: #0b0b0c;         /* page background (dark theme) */
--text: #f3f1ec;       /* main text */
```
The light theme has its own values under `[data-theme="light"]` just below.
Fonts: change `--font-display`, `--font-body` (and the Google Fonts `<link>` in `index.html`).

### Change which theme opens first
In `index.html`'s first `<script>` the site remembers the visitor's choice. Dark is the default. To default to light, add `data-theme="light"` to the opening `<html lang="en">` tag.

### Change / add / remove sections
Each section in `index.html` is one `<section id="…">` block with clear comment banners.
- **Remove a section:** delete its whole `<section>…</section>` block *and* its link in the `<ul class="nav__links">` menu.
- **Add a Service:** copy one `<li class="service reveal">…</li>` and edit it.
- **Add a Process step:** copy one `<li class="step reveal">…</li>`; also change `repeat(4, 1fr)` to `repeat(5, 1fr)` in `style.css` (section 10).
- **New section:** copy an existing section, change its `id` and `data-scene="…"`, then add `<li><a href="#your-id">Name</a></li>` to the menu.
- **Reorder sections:** cut/paste whole `<section>` blocks (and reorder the menu links).
- **Animate anything on scroll:** add `class="reveal"` to the element. Add `style="--delay:.1s"` to stagger it.

### Make the contact form send emails directly
The form currently opens the visitor's email app (that's all a front-end-only site can do). Later, if you want it to send without opening an app, a free service like **Formspree** (https://formspree.io) works with plain HTML — ask me and I'll show you how.

---

## 9. How the code works (so you're not just copy-pasting)

### `index.html` — the skeleton
- Top `<head>`: title, description, fonts, and the link to `style.css`.
- `<header class="nav">` — the menu bar. Links like `href="#work"` jump to `<section id="work">`.
- `<main>` holds 6 sections: **Hero → Work → About → Services → Process → Contact**.
- `data-config="name"` on an element means *"JavaScript, fill this with `SITE.name` from config.js."* That's how your name appears in many places from one edit.
- `class="reveal"` marks things that fade up when scrolled into view.
- The `<div class="modal">` at the bottom is the video pop-up (empty until a video is clicked).
- Last lines load `config.js` **first**, then `main.js`.

### `js/config.js` — your content
One JavaScript object called `SITE`. `main.js` reads it to build the video cards, filter buttons, stats, tools strip and links.

### `js/main.js` — the behaviour (each block is numbered & commented)
| Part | What it does |
|------|--------------|
| 2. Video helpers | Decides whether a `video:` value is a file or a YouTube link. A missing/misspelled file shows the placeholder look. |
| 3. Fill from config | Writes your name/email/socials/stats into the page. |
| 4. Video grid | Builds a card for each video, and the category filter buttons. |
| 5. Pop-up | On click, creates a video player for your file and shows it. Closing removes it so the video stops. Esc also closes. |
| 7. Navigation | Mobile menu, menu hides when scrolling down / returns when scrolling up, highlights the current section. |
| 8. Scroll effects | One function updates the timeline bar, timecode, showreel zoom and process line (efficiently, once per frame). |
| 9. Reveal + counters | `IntersectionObserver` watches elements and adds `is-visible` when they appear; numbers count up. |
| 10. Cursor | The custom dot / "PLAY" cursor (mouse devices only). |

### `css/style.css` — the look
Numbered sections with a table of contents at the top. Key ideas:
- **CSS variables** (`--accent`, `--bg`…) hold colours so one change updates everything.
- **Responsive design:** the layout is built for phones first; `@media (min-width: …)` blocks add 2 columns on tablets (640px+) and 3 columns / desktop navigation on larger screens (900px / 1024px+).
- **Animations** use `transform` and `opacity` (smooth, cheap for the browser). `prefers-reduced-motion` turns them off for people who need that.

---

## 10. Troubleshooting

| Problem | Fix |
|---------|-----|
| Video won't play / stays black | Export as **MP4 with H.264 video + AAC audio** (HandBrake does this). Other formats (e.g. some .mov / HEVC files) don't play in every browser. |
| Video takes long to start | The file is too big. Re-compress it (section 5, Step A) and tick **Web Optimized**. |
| `git push` says file too large | A video is over 100 MB. Compress it, delete the big one, then `git add .` and commit again. If you already committed it, ask me — it needs one extra step to remove from history. |
| Card still shows "placeholder" | The file isn't found. Check the path in `config.js` matches the real file name exactly (capital letters, `.mp4`, no spaces), and that the file is inside `assets/videos/`. |
| My changes don't show | Save the file (Ctrl+S), then hard-refresh: **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**). On the live site, make sure you ran `git add .`, `git commit`, `git push`. |
| Whole page looks broken / blank | A comma, quote or bracket in `config.js` was deleted. Press **F12** in the browser → **Console** tab — it shows the line number of the problem. Or undo with **Ctrl+Z**. |
| `git push` is rejected | Run `git pull origin main --allow-unrelated-histories`, then `git push` again (usually happens if you ticked "Add a README" when creating the repo). |
| Vercel shows 404 | In Vercel → Settings → General, make sure **Root Directory** is the folder that contains `index.html`. |

Enjoy your new site! 🎞️
#   a b e n e z e r - p o r t f o l i o - w e b  
 