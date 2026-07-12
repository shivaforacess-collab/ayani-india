// AYINI India — gallery.js
// Automatically lists whatever image files are sitting in assets/images/gallery/
// by reading the folder through the public GitHub API. To add a photo to the
// live gallery: just upload a new image file into assets/images/gallery/ in the
// repo — no HTML/JS edits needed. Name the file starting with one of:
//   rnd-...        -> "Research & Development"
//   training-...   -> "Training"
//   compliance-...  -> "Compliance & Audits"
//   supplier- / team- / customer- / stakeholder-...  -> "Stakeholders"
// any other prefix simply appears under "All" with a generic caption.

(function () {
  const GRID_SELECTOR = '#gallery-grid';
  const SKELETON_SELECTOR = '#gallery-skeleton';
  const FOLDER_PATH = 'assets/images/gallery';
  const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

  const grid = document.querySelector(GRID_SELECTOR);
  if (!grid) return; // not on the gallery page

  const skeleton = document.querySelector(SKELETON_SELECTOR);

  // Static fallback — used if the GitHub API can't be reached (offline, local
  // XAMPP testing, rate-limited, etc.) so the page never shows an empty gallery.
  const FALLBACK_IMAGES = [
    { name: 'rnd-lab.jpg', src: '../assets/images/gallery/rnd-lab.jpg' },
    { name: 'training-session.jpg', src: '../assets/images/gallery/training-session.jpg' },
    { name: 'compliance-floor.jpg', src: '../assets/images/gallery/compliance-floor.jpg' },
    { name: 'supplier-compliance.jpg', src: '../assets/images/gallery/supplier-compliance.jpg' },
    { name: 'team-collaboration.jpg', src: '../assets/images/gallery/team-collaboration.jpg' },
    { name: 'customer-trust.jpg', src: '../assets/images/gallery/customer-trust.jpg' },
    { name: 'brand-corporate-profile-poster.jpg', src: '../assets/images/gallery/brand-corporate-profile-poster.jpg' },
    { name: 'brand-college-training-poster.jpg', src: '../assets/images/gallery/brand-college-training-poster.jpg' }
  ];

  function detectCategory(filename) {
    const n = filename.toLowerCase();
    if (n.startsWith('rnd')) return { key: 'rnd', label: 'Research & Development' };
    if (n.startsWith('training')) return { key: 'training', label: 'Training' };
    if (n.startsWith('compliance')) return { key: 'compliance', label: 'Compliance & Audits' };
    if (n.startsWith('supplier') || n.startsWith('team') || n.startsWith('customer') || n.startsWith('stakeholder')) {
      return { key: 'stakeholders', label: 'Stakeholders' };
    }
    if (n.startsWith('brand') || n.startsWith('poster')) return { key: 'brand', label: 'Brand & Marketing' };
    return { key: 'other', label: 'AYINI India' };
  }

  function niceCaption(filename, categoryLabel) {
    const base = filename.replace(IMAGE_EXT, '').replace(/[-_]+/g, ' ').trim();
    const title = base.replace(/\b\w/g, c => c.toUpperCase());
    return `${categoryLabel} — ${title}`;
  }

  function deriveRepoInfo() {
    // Works for GitHub Pages project sites: https://<user>.github.io/<repo>/...
    const host = location.hostname; // e.g. shivaforacess-collab.github.io
    const isGithubPages = /\.github\.io$/.test(host);
    if (!isGithubPages) return null;
    const owner = host.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean);
    const repo = seg[0];
    if (!owner || !repo) return null;
    return { owner, repo };
  }

  async function fetchGalleryFiles() {
    const repoInfo = deriveRepoInfo();
    if (!repoInfo) throw new Error('Not on GitHub Pages — using fallback list.');
    const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${FOLDER_PATH}`;
    const res = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('GitHub API request failed: ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Unexpected GitHub API response.');
    return data
      .filter(item => item.type === 'file' && IMAGE_EXT.test(item.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => ({ name: item.name, src: item.download_url }));
  }

  function buildCards(images) {
    grid.innerHTML = '';
    const usedCategories = new Set();

    images.forEach((img, i) => {
      const cat = detectCategory(img.name);
      usedCategories.add(cat.key);
      const caption = niceCaption(img.name, cat.label);

      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.dataset.category = cat.key;
      card.style.setProperty('--gd', Math.min(i * 60, 600) + 'ms');
      card.innerHTML = `
        <img src="${img.src}" alt="${caption}" loading="lazy">
        <div class="zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
        <div class="cap">${caption}</div>
      `;
      grid.appendChild(card);
    });

    // Hide filter buttons for categories that have no images right now
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const f = btn.dataset.filter;
      btn.style.display = (f === 'all' || usedCategories.has(f)) ? '' : 'none';
    });

    wireFilters();
    wireLightbox();
  }

  function wireFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = () => Array.from(grid.querySelectorAll('.gallery-card'));
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards().forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  function wireLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lb-caption');
    const cards = () => Array.from(grid.querySelectorAll('.gallery-card')).filter(c => c.style.display !== 'none');
    let currentIndex = 0;

    const render = () => {
      const items = cards();
      const img = items[currentIndex].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.classList.remove('zoomed');
      lbCaption.textContent = img.alt;
    };
    const open = (index) => {
      currentIndex = index;
      render();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    const step = (delta) => {
      const items = cards();
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render();
    };
    const setZoom = (zoomIn) => {
      lbImg.classList.toggle('zoomed', zoomIn);
    };

    grid.querySelectorAll('.gallery-card').forEach((card) => {
      card.addEventListener('click', () => {
        const items = cards();
        const idx = items.indexOf(card);
        open(idx === -1 ? 0 : idx);
      });
    });

    lightbox.querySelector('.lb-close').onclick = close;
    lightbox.querySelector('.lb-nav.prev').onclick = () => step(-1);
    lightbox.querySelector('.lb-nav.next').onclick = () => step(1);
    const zoomInBtn = lightbox.querySelector('.lb-zoom.in');
    const zoomOutBtn = lightbox.querySelector('.lb-zoom.out');
    if (zoomInBtn) zoomInBtn.onclick = () => setZoom(true);
    if (zoomOutBtn) zoomOutBtn.onclick = () => setZoom(false);
    lbImg.onclick = () => setZoom(!lbImg.classList.contains('zoomed'));

    lightbox.onclick = (e) => { if (e.target === lightbox) close(); };
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === '+') setZoom(true);
      if (e.key === '-') setZoom(false);
    });
  }

  function showEmptyState() {
    grid.innerHTML = '<div class="gallery-empty"><i class="fa-regular fa-images" style="font-size:32px;margin-bottom:12px;display:block;"></i>No images have been added to the gallery yet.</div>';
  }

  async function init() {
    try {
      const files = await fetchGalleryFiles();
      if (skeleton) skeleton.style.display = 'none';
      grid.style.display = 'grid';
      if (files.length === 0) { showEmptyState(); return; }
      buildCards(files);
    } catch (err) {
      // Fall back to the known static set (also covers local/XAMPP testing where
      // the GitHub API path doesn't apply).
      if (skeleton) skeleton.style.display = 'none';
      grid.style.display = 'grid';
      buildCards(FALLBACK_IMAGES);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
