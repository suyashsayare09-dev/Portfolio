const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const lightbox = document.getElementById('lightbox');
const lightboxInner = document.getElementById('lightboxInner');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const scrollProgress = document.getElementById('scrollProgress');
const siteHeader = document.getElementById('siteHeader');

menuBtn?.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuBtn.classList.toggle('active');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.classList.remove('active');
  });
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealEls.forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
    });
  });
}, { rootMargin: '-35% 0px -45% 0px', threshold: 0.01 });

sections.forEach((section) => sectionObserver.observe(section));

function openLightbox(type, src, caption = '') {
  if (!lightbox || !lightboxInner || !src) return;
  lightboxInner.innerHTML = '';

  if (type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    lightboxInner.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = caption || 'Project preview';
    lightboxInner.appendChild(img);
  }

  if (lightboxCaption) {
    lightboxCaption.textContent = caption || '';
  }

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxInner) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxInner.innerHTML = '';
  if (lightboxCaption) lightboxCaption.textContent = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.media-button[data-src]').forEach((button) => {
  button.addEventListener('click', () => {
    openLightbox(
      button.dataset.type || 'image',
      button.dataset.src,
      button.dataset.caption || ''
    );
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

/* autoplay and pause videos depending on visibility */
const previewVideos = document.querySelectorAll('.project-preview');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      const promise = video.play();
      if (promise) promise.catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.35 });

previewVideos.forEach((video) => {
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  videoObserver.observe(video);
});

function updateScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  if (siteHeader) siteHeader.classList.toggle('scrolled', scrollTop > 30);

  document.querySelectorAll('.parallax-card').forEach((card) => {
    const y = Math.min(scrollTop * 0.025, 16);
    card.style.transform = `translateY(${y}px)`;
  });
}

window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('load', updateScrollEffects);

/* tilt cards on desktop only */
document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 992) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* project filters */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-showcase');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const category = card.dataset.category || '';
      const show = filter === 'all' || category === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
});
