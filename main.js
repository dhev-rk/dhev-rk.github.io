/* ==========================================================
   Blog engine — no build step required.
   To publish a new post:
     1. Add a file  posts/your-slug.md   (with a front-matter block, see posts/example-post.md)
     2. Add one entry to posts/posts.json pointing at that file
   That's it — index.html and blog.html pick it up automatically.
   ========================================================== */

async function fetchPostsIndex() {
  const res = await fetch('posts/posts.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load posts.json');
  const data = await res.json();
  // newest first
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadPosts({ target, limit } = {}) {
  const list = document.getElementById(target);
  try {
    let posts = await fetchPostsIndex();
    if (limit) posts = posts.slice(0, limit);

    if (posts.length === 0) {
      list.innerHTML = '<li class="state-msg">No notes published yet — check back soon.</li>';
      return;
    }

    list.innerHTML = posts.map(p => `
      <li class="post-item">
        <div class="post-date">${formatDate(p.date)}</div>
        <div>
          <h3><a href="post.html?slug=${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a></h3>
          <p>${escapeHtml(p.summary || '')}</p>
          ${p.tags ? `<div class="post-tags">${p.tags.map(escapeHtml).join(' · ')}</div>` : ''}
        </div>
      </li>
    `).join('');
  } catch (err) {
    list.innerHTML = '<li class="state-msg">Could not load notes right now.</li>';
    console.error(err);
  }
}

async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const titleEl = document.getElementById('post-title');
  const dateEl = document.getElementById('post-date');
  const tagsEl = document.getElementById('post-tags');
  const contentEl = document.getElementById('post-content');

  if (!slug) {
    titleEl.textContent = 'Note not found';
    contentEl.innerHTML = '<p>No note was specified. <a href="blog.html">Back to all notes →</a></p>';
    return;
  }

  try {
    const posts = await fetchPostsIndex();
    const meta = posts.find(p => p.slug === slug);
    if (!meta) throw new Error('Post not in index');

    const res = await fetch(`posts/${meta.file}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not fetch markdown file');
    const raw = await res.text();
    const body = stripFrontMatter(raw);

    document.title = `${meta.title} — Dhevathi Rajagopalan Kannan`;
    titleEl.textContent = meta.title;
    dateEl.textContent = formatDate(meta.date);
    tagsEl.textContent = meta.tags ? meta.tags.join(' · ') : '';
    contentEl.innerHTML = marked.parse(body);
  } catch (err) {
    titleEl.textContent = 'Note not found';
    contentEl.innerHTML = '<p>This note could not be loaded. <a href="blog.html">Back to all notes →</a></p>';
    console.error(err);
  }
}

// Removes a leading --- front-matter block if present, since metadata
// already lives in posts.json — keeps the markdown files simple.
function stripFrontMatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) return md.slice(end + 4).trim();
  }
  return md;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
