/* Your JS here. */

// Helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Year in footer
$("#year").textContent = new Date().getFullYear();

// Sticky + Resizing Navbar + Active Link + Reading Progress
const header = $("#site-header");
const navLinks = $$(".nav__link");
const sections = navLinks.map((a) => $(a.getAttribute("href")));

let lastScrollY = 0;
const shrinkAt = 10;

function updateNavState() {
  const y = window.scrollY || window.pageYOffset;

  // Shrink header
  header.classList.toggle("is-shrink", y > shrinkAt);

  // Reading progress
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? Math.min(100, (y / docH) * 100) : 0;
  $(".reading-progress__bar").style.width = `${pct}%`;

  // Active link based on section below bottom of navbar
  const navBottom = header.getBoundingClientRect().bottom + window.scrollY;

  let activeIndex = sections.findIndex((sec) => {
    const rect = sec.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = top + rect.height;
    return navBottom >= top && navBottom < bottom;
  });

  // If at bottom of page, highlight the last item
  if (window.innerHeight + y >= document.body.scrollHeight - 2) {
    activeIndex = sections.length - 1;
  }

  navLinks.forEach((a, i) => a.classList.toggle("is-active", i === activeIndex));

  lastScrollY = y;
}

updateNavState();
window.addEventListener("scroll", updateNavState);
window.addEventListener("resize", updateNavState);

// Smooth scrolling for nav links
navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href");
    const target = $(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });

    // close mobile menu if open
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Mobile menu 
const navToggle = $(".nav__toggle");
const navMenu = $("#navmenu");
navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Carousel (vanilla)
(function initCarousel() {
  const slider = $(".slider");
  if (!slider) return;

  const track = $(".slider__track", slider);
  const slides = $$(".slide", track);
  const prev = $(".slider__arrow--prev", slider);
  const next = $(".slider__arrow--next", slider);

  let index = 0;

  function show(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    track.style.transition = "transform 400ms ease";
  }

  prev.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));

  // Keyboard support when slider is focused
  slider.tabIndex = 0;
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  show(0);
})();

// Modal
(function initModal() {
  const openers = $$("[data-open-modal]");
  const closeSelectors = "[data-close-modal]";
  let activeModal = null;

  function openModal(id) {
    activeModal = $(id);
    if (!activeModal) return;
    activeModal.setAttribute("aria-hidden", "false");
    const dialog = $(".modal__dialog", activeModal);
    dialog?.focus?.();
  }
  function closeModal() {
    if (!activeModal) return;
    activeModal.setAttribute("aria-hidden", "true");
    activeModal = null;
  }

  openers.forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.openModal));
  });

  document.addEventListener("click", (e) => {
    if (
      activeModal &&
      (e.target.matches(closeSelectors) || e.target.closest(closeSelectors))
    ) {
      closeModal();
    }
  });

  document.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");
  if (window.scrollY > 50) {
    header.classList.add("is-shrink");
  } else {
    header.classList.remove("is-shrink");
  }
});

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeModal) closeModal();
  });
})();

// Console hello to match starter
console.log("Hello World! Welcome to MP1!");

