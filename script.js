/* ==================================================
   BIYANI BYTES — site scripts
   - Locomotive Scroll (smooth scrolling)
   - Mobile hamburger menu
   - Smooth in-page navigation (Locomotive-aware)
================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const scrollContainer = document.querySelector('[data-scroll-container]');
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelectorAll('.nav-links a');

  /* ---------- Nav overlay (created once, used on mobile) ---------- */
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  /* ---------- Locomotive Scroll init ---------- */
  let scroll = null;

  if (window.LocomotiveScroll && scrollContainer) {
    scroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: { smooth: false }, // native scroll on phones = better perf + no jank with fixed header
      tablet: { smooth: false }
    });

    // Keep Locomotive's internal size calculations correct if images/fonts
    // shift layout after load, and on window resize.
    window.addEventListener('load', () => scroll.update());
    window.addEventListener('resize', () => scroll.update());
  }

  /* ---------- Mobile hamburger menu ---------- */
  function openMenu() {
    navbar.classList.add('active');
    hamburger.classList.add('active');
    overlay.classList.add('active');
    hamburger.textContent = '✕';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navbar.classList.remove('active');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.textContent = '☰';
    document.body.style.overflow = '';
  }

  window.toggleMenu = function () {
    if (navbar.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Tapping the dark overlay closes the menu
  overlay.addEventListener('click', closeMenu);

  // Close the menu after tapping a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // If the viewport is resized back up to desktop, make sure the mobile
  // menu state doesn't stay stuck open
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navbar.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ---------- Smooth anchor navigation ---------- */
  // Locomotive Scroll intercepts native scrolling, so plain #anchor links
  // need to be routed through scroll.scrollTo() to land in the right spot.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (scroll) {
        scroll.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- "Beyond Biryani" arrow (stub) ---------- */
  // Wired up so the onclick="viewMore()" in the HTML doesn't error.
  // Replace with real navigation (e.g. to a full menu page) when ready.
  window.viewMore = function () {
    const dishes = document.querySelector('#dishes');
    if (dishes) {
      if (scroll) {
        scroll.scrollTo(dishes);
      } else {
        dishes.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

});