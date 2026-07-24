/* ==========================================================
   Blog engine — no build step required.
   To publish a new post:
     1. Add a file  posts/your-slug.md
     2. Add one entry to posts/posts.json pointing at that file
        (optional fields: tags, related [{title, url}], references [{text, url}])
   That's it — index.html and blog.html pick it up automatically.
   ========================================================== */

async function fetchPostsIndex() {
  const res = await fetch('posts/posts.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load posts.json');
  const data = await res.json();
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
  const contentEl = document.getElementById('post-content');
  const tagsEl = document.getElementById('rail-tags');
  const relatedWrap = document.getElementById('rail-related-wrap');
  const relatedEl = document.getElementById('rail-related');
  const refsBlock = document.getElementById('references-block');
  const refsList = document.getElementById('references-list');

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
    contentEl.innerHTML = marked.parse(body);

    // Tags
    if (meta.tags && meta.tags.length) {
      tagsEl.innerHTML = meta.tags.map(t => `<span class="rail-tag">${escapeHtml(t)}</span>`).join('');
    } else {
      tagsEl.innerHTML = '<span class="rail-tag">notes</span>';
    }

    // Related
    if (meta.related && meta.related.length) {
      relatedWrap.style.display = 'block';
      relatedEl.innerHTML = meta.related.map(r =>
        `<li><a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.title)}</a></li>`
      ).join('');
    }

    // References
    if (meta.references && meta.references.length) {
      refsBlock.style.display = 'block';
      refsList.innerHTML = meta.references.map(r =>
        `<li><a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.text)}</a></li>`
      ).join('');
    }

    // Share links
    const pageUrl = window.location.href;
    document.getElementById('share-email').href = `mailto:?subject=${encodeURIComponent(meta.title)}&body=${encodeURIComponent(pageUrl)}`;
    document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(pageUrl)}`;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
    document.getElementById('share-copy').addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(pageUrl).then(() => {
        e.target.textContent = '✓';
        setTimeout(() => { e.target.textContent = '🔗'; }, 1500);
      });
    });

  } catch (err) {
    titleEl.textContent = 'Note not found';
    contentEl.innerHTML = '<p>This note could not be loaded. <a href="blog.html">Back to all notes →</a></p>';
    console.error(err);
  }
}

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
function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}
