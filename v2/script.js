/* ======================================================
   MALA TREE — SCRIPT.JS
   Vanilla JS only. Organized by feature. No external dependencies.
   ====================================================== */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "917681915216"; // country code + number, no + or spaces

  /* ---------- Preloader ---------- */
  (function () {
    var preloader = document.getElementById("preloader");
    if (!preloader) return;
    var minDisplay = 700; // ms — avoid a jarring flash on fast connections
    var shown = Date.now();
    var hidden = false;

    function hidePreloader() {
      if (hidden) return;
      hidden = true;
      var elapsed = Date.now() - shown;
      var wait = Math.max(0, minDisplay - elapsed);
      setTimeout(function () {
        preloader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        setTimeout(function () {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 650);
      }, wait);
    }

    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader);
    }
    // safety net: never let the preloader block the site indefinitely
    setTimeout(hidePreloader, 4000);
  })();

  /* ---------- Sticky header on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("DOMContentLoaded", onScrollHeader);
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.classList.toggle("is-active", isOpen);
      if (header) header.classList.toggle("nav-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("is-active");
        if (header) header.classList.remove("nav-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal: subtle fade + small translate, once ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min(i * 50, 200);
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById("backToTop");
  function onScrollBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", onScrollBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById("accordion");
  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion__trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion__item");
        var panel = item.querySelector(".accordion__panel");
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // close all others
        triggers.forEach(function (t) {
          if (t !== trigger) {
            t.setAttribute("aria-expanded", "false");
            t.closest(".accordion__item").querySelector(".accordion__panel").style.maxHeight = null;
          }
        });

        if (isOpen) {
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- Contact form -> WhatsApp handoff ---------- */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var contact = document.getElementById("cf-contact").value.trim();
      var interest = document.getElementById("cf-interest").value;
      var message = document.getElementById("cf-message").value.trim();

      if (!name || !contact || !message) {
        formStatus.textContent = "Please fill in your name, contact info and message.";
        formStatus.style.color = "#A54F2B";
        return;
      }

      var text =
        "Namaste, I'm " + name + ".\n" +
        "Interested in: " + interest + "\n" +
        "Message: " + message + "\n" +
        "You can reach me at: " + contact;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

      formStatus.textContent = "Opening WhatsApp with your message ready to send…";
      formStatus.style.color = "#6E7F63";

      window.open(url, "_blank", "noopener");
      contactForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Portfolio auto-scroll ----------
     Purely CSS-driven (see .portfolio-track keyframes in style.css):
     it scrolls continuously, pauses on hover via CSS, and switches to a
     manual horizontal-scroll strip automatically under prefers-reduced-motion
     (also handled in CSS). No JS needed to drive the motion itself. */

})();

/* ======================================================
   MALA TREE — PRODUCT DATA
   Data-driven so images/products can be swapped without
   touching layout code. Each item: id, name, category,
   desc, image.
   ====================================================== */
(function () {
  "use strict";

  var PRODUCTS = [
    { id: "p1", name: "Rudraksha Mala", category: "mala", desc: "Rudraksha · Cotton tassel", image: "assets/images/products/malas/mala-01.jpg" },
    { id: "p2", name: "Black Onyx Mala", category: "mala", desc: "Rudraksha · Hand-strung", image: "assets/images/products/malas/mala-02.jpg" },
    { id: "p3", name: "Sandalwood Mala", category: "mala", desc: "Sacred wood beads", image: "assets/images/products/malas/mala-03.jpg" },
    { id: "p4", name: "108-Bead Rudraksha Mala", category: "mala", desc: "Rudraksha · 108 beads", image: "assets/images/products/malas/mala-04.jpg" },
    { id: "p5", name: "Tasseled Rudraksha Mala", category: "mala", desc: "Rudraksha · Tasseled finish", image: "assets/images/products/malas/mala-05.jpg" },
    { id: "p6", name: "Smoky Quartz Mala", category: "mala", desc: "Crystal · Natural stone", image: "assets/images/products/malas/mala-06.jpg" },
    { id: "p7", name: "Multi-Strand Rudraksha Mala", category: "mala", desc: "Rudraksha · Multi-strand", image: "assets/images/products/malas/mala-07.jpg" },
    { id: "p8", name: "Rose Quartz Mala", category: "mala", desc: "Crystal · Hand-selected", image: "assets/images/products/malas/mala-08.jpg" },
    { id: "p9", name: "Karungali Mala", category: "mala", desc: "Karungali wood", image: "assets/images/products/malas/mala-09.jpg" },
    { id: "p10", name: "Rudraksha & Silver Mala", category: "mala", desc: "Rudraksha · Silver accents", image: "assets/images/products/malas/mala-10.jpg" },
    { id: "p11", name: "Bodhi Seed Mala", category: "mala", desc: "Bodhi seed · Natural", image: "assets/images/products/malas/mala-11.jpg" },
    { id: "p12", name: "Layered Rudraksha Mala", category: "mala", desc: "Rudraksha · Layered strand", image: "assets/images/products/malas/mala-12.jpg" },
    { id: "p13", name: "Sandalwood Tassel Mala", category: "mala", desc: "Sandalwood · Tasseled", image: "assets/images/products/malas/mala-13.jpg" },
    { id: "p14", name: "Neck-to-Wrist Rudraksha Mala", category: "mala", desc: "Rudraksha · Extra length", image: "assets/images/products/malas/mala-14.jpg" },
    { id: "p15", name: "Grey Agate Mala", category: "mala", desc: "Agate · Natural stone", image: "assets/images/products/malas/mala-15.jpg" },
    { id: "p16", name: "Rudraksha Meditation Mala", category: "mala", desc: "Rudraksha · Meditation length", image: "assets/images/products/malas/mala-16.jpg" },
    { id: "p17", name: "Dark Sandalwood Mala", category: "mala", desc: "Sandalwood · Dark finish", image: "assets/images/products/malas/mala-17.jpg" },
    { id: "p18", name: "Rudraksha Prayer Mala", category: "mala", desc: "Rudraksha · Traditional", image: "assets/images/products/malas/mala-18.jpg" },
    { id: "p19", name: "Ivory Bead Mala", category: "mala", desc: "Bone bead · Ivory tone", image: "assets/images/products/malas/mala-19.jpg" },
    { id: "p20", name: "Chunky Rudraksha Mala", category: "mala", desc: "Rudraksha · Large bead", image: "assets/images/products/malas/mala-20.jpg" },
    { id: "p21", name: "Layered Bead Mala", category: "mala", desc: "Mixed bead · Layered", image: "assets/images/products/malas/mala-21.jpg" },
    { id: "p22", name: "Natural Wood Mala", category: "mala", desc: "Natural wood · Hand-selected", image: "assets/images/products/malas/mala-22.jpg" },
    { id: "p23", name: "Rudraksha Pendant Mala", category: "mala", desc: "Rudraksha · With pendant", image: "assets/images/products/malas/mala-23.jpg" },
    { id: "p24", name: "Classic 108 Mala", category: "mala", desc: "Rudraksha · Classic 108", image: "assets/images/products/malas/mala-24.jpg" },
    { id: "p25", name: "Rudraksha Trio Mala", category: "mala", desc: "Rudraksha · Set of three", image: "assets/images/products/malas/mala-25.jpg" },
    { id: "p26", name: "Rudraksha Stretch Bracelet", category: "bracelet", desc: "Rudraksha · Elasticated", image: "assets/images/products/bracelets/bracelet-01.jpg" },
    { id: "p27", name: "Lava Stone Bracelet", category: "bracelet", desc: "Lava stone · Natural", image: "assets/images/products/bracelets/bracelet-02.jpg" },
    { id: "p28", name: "Rudraksha Charm Bracelet", category: "bracelet", desc: "Rudraksha · Initial charm", image: "assets/images/products/bracelets/bracelet-03.jpg" },
    { id: "p29", name: "Tiger's Eye Bracelet", category: "bracelet", desc: "Tiger's eye · Natural stone", image: "assets/images/products/bracelets/bracelet-04.jpg" },
    { id: "p30", name: "Turquoise Rondelle Bracelet", category: "bracelet", desc: "Turquoise & wood · Rondelle", image: "assets/images/products/bracelets/bracelet-05.jpg" },
    { id: "p31", name: "Sandalwood Bracelet", category: "bracelet", desc: "Sandalwood · Hand-strung", image: "assets/images/products/bracelets/bracelet-06.jpg" },
    { id: "p32", name: "Rudraksha Bead Bracelet", category: "bracelet", desc: "Rudraksha · Everyday wear", image: "assets/images/products/bracelets/bracelet-07.jpg" },
    { id: "p33", name: "Black Onyx Bracelet", category: "bracelet", desc: "Black onyx · Natural stone", image: "assets/images/products/bracelets/bracelet-08.jpg" },
    { id: "p34", name: "Bone Bead Bracelet", category: "bracelet", desc: "Bone bead · Natural tone", image: "assets/images/products/bracelets/bracelet-09.jpg" },
    { id: "p35", name: "Rudraksha Wrap Bracelet", category: "bracelet", desc: "Rudraksha · Wrap style", image: "assets/images/products/bracelets/bracelet-10.jpg" },
    { id: "p36", name: "Ebony Wood Bracelet", category: "bracelet", desc: "Ebony wood · Dark finish", image: "assets/images/products/bracelets/bracelet-11.jpg" },
    { id: "p37", name: "Knotted Cord Bracelet", category: "bracelet", desc: "Cord · Hand-knotted", image: "assets/images/products/bracelets/bracelet-12.jpg" },
    { id: "p38", name: "Layered Bead Bracelet", category: "bracelet", desc: "Mixed bead · Layered", image: "assets/images/products/bracelets/bracelet-13.jpg" },
    { id: "p39", name: "Om Pendant", category: "pendant", desc: "Silver · Om symbol", image: "assets/images/products/pendants/pendant-01.jpg" },
    { id: "p40", name: "Shell Pendant Set", category: "pendant", desc: "Shell · Set of four", image: "assets/images/products/pendants/pendant-02.jpg" },
    { id: "p41", name: "Rudraksha Pendant", category: "pendant", desc: "Rudraksha · Copper cap", image: "assets/images/products/pendants/pendant-03.jpg" },
    { id: "p42", name: "Gold Chain Pendant", category: "pendant", desc: "Brass chain · Snake clasp", image: "assets/images/products/pendants/pendant-04.jpg" },
    { id: "p43", name: "Abalone Shell Pendant", category: "pendant", desc: "Abalone shell · Natural", image: "assets/images/products/pendants/pendant-05.jpg" },
    { id: "p44", name: "Labradorite Trio Pendant", category: "pendant", desc: "Labradorite · Three sizes", image: "assets/images/products/pendants/pendant-06.jpg" },
    { id: "p45", name: "Pearl Drop Pendant", category: "pendant", desc: "Freshwater pearl · Gold accent", image: "assets/images/products/pendants/pendant-07.jpg" },
    { id: "p46", name: "Raw Crystal Pendant", category: "pendant", desc: "Raw crystal · Brass setting", image: "assets/images/products/pendants/pendant-08.jpg" },
    { id: "p47", name: "Moonstone Pendant", category: "pendant", desc: "Moonstone · Silver setting", image: "assets/images/products/pendants/pendant-09.jpg" },
    { id: "p48", name: "Sodalite Pendant", category: "pendant", desc: "Sodalite · Gold chain", image: "assets/images/products/pendants/pendant-10.jpg" },
    { id: "p49", name: "Sodalite & Pearl Pendant", category: "pendant", desc: "Sodalite & pearl · Layered", image: "assets/images/products/pendants/pendant-11.jpg" },
  ];

  window.__MALATREE_PRODUCTS__ = PRODUCTS;
})();

/* ======================================================
   HERO — cinematic entrance trigger
   ====================================================== */
(function () {
  "use strict";
  var heroEl = document.querySelector(".hero");
  if (!heroEl) return;
  requestAnimationFrame(function () {
    setTimeout(function () { heroEl.classList.add("is-ready"); }, 60);
  });
})();

/* ======================================================
   PRODUCTS — carousel, category filter, expandable
   gallery, and a premium lightbox viewer.
   ====================================================== */
(function () {
  "use strict";

  var PRODUCTS = window.__MALATREE_PRODUCTS__ || [];
  var track = document.getElementById("productTrack");
  var viewport = document.getElementById("productViewport");
  var carouselEl = document.getElementById("productCarousel");
  var filterWrap = document.getElementById("productFilter");
  var filterBtns = filterWrap ? Array.prototype.slice.call(filterWrap.querySelectorAll(".product-filter__btn")) : [];
  var indicator = filterWrap ? filterWrap.querySelector(".product-filter__indicator") : null;
  var prevBtn = document.getElementById("carouselPrev");
  var nextBtn = document.getElementById("carouselNext");
  var dotsWrap = document.getElementById("carouselDots");
  var viewAllBtn = document.getElementById("viewAllBtn");
  var viewAllWrap = viewAllBtn ? viewAllBtn.closest(".products__view-all") : null;
  var galleryWrap = document.getElementById("productGallery");
  var galleryGrid = document.getElementById("productGalleryGrid");

  if (!track || !viewport || !PRODUCTS.length) return;

  var currentFilter = "all";
  var galleryOpen = false;
  var autoTimer = null;
  var resumeTimer = null;
  var isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CATEGORY_ORDER = ["mala", "bracelet", "pendant"];

  /* Weave the three categories together (mala, bracelet, pendant, mala, ...)
     instead of showing them as three separate back-to-back blocks. */
  function interleaveByCategory(products) {
    var buckets = CATEGORY_ORDER.map(function (c) {
      return products.filter(function (p) { return p.category === c; });
    });
    var maxLen = buckets.reduce(function (m, b) { return Math.max(m, b.length); }, 0);
    var result = [];
    for (var i = 0; i < maxLen; i++) {
      buckets.forEach(function (bucket) {
        if (bucket[i]) result.push(bucket[i]);
      });
    }
    return result;
  }

  function filteredProducts(filter) {
    if (filter === "all") return interleaveByCategory(PRODUCTS);
    return PRODUCTS.filter(function (p) { return p.category === filter; });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function cardMarkup(p) {
    return (
      '<article class="product-card" data-id="' + p.id + '" tabindex="0" role="button" aria-label="View ' + esc(p.name) + '">' +
        '<div class="product-card__image">' +
          '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy">' +
          '<span class="product-card__zoom" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20.5 20.5 15 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>' +
        "</div>" +
        "<h3>" + esc(p.name) + "</h3>" +
        "<p>" + esc(p.desc) + "</p>" +
      "</article>"
    );
  }

  function galleryItemMarkup(p) {
    return (
      '<div class="gallery-item" data-id="' + p.id + '" tabindex="0" role="button" aria-label="View ' + esc(p.name) + '">' +
        '<div class="gallery-item__image"><img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        "<h4>" + esc(p.name) + "</h4><span>" + esc(p.desc) + "</span>" +
      "</div>"
    );
  }

  var cardObserver = null;
  if ("IntersectionObserver" in window) {
    cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add("is-visible"); }, Math.min(i * 35, 260));
          cardObserver.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -10px 0px" });
  }

  function observeNew(container, selector) {
    var els = container.querySelectorAll(selector);
    if (isReducedMotion || !cardObserver) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    els.forEach(function (el) { cardObserver.observe(el); });
  }

  function updateNavButtons() {
    var atStart = viewport.scrollLeft <= 4;
    var atEnd = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4;
    if (prevBtn && nextBtn) {
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    }
    updateDots();
  }

  /* ---- dot indicators (mobile) ---- */
  var dotEls = [];
  function cardStep() {
    var card = track.querySelector(".product-card");
    if (!card) return 0;
    var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    return card.getBoundingClientRect().width + gap;
  }
  function renderDots() {
    if (!dotsWrap) return;
    var cards = track.querySelectorAll(".product-card");
    dotEls = [];
    if (cards.length <= 1) { dotsWrap.innerHTML = ""; return; }
    var frag = document.createDocumentFragment();
    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dots__dot";
      dot.setAttribute("aria-label", "Go to product " + (i + 1));
      dot.addEventListener("click", function () {
        pauseAuto();
        viewport.scrollTo({ left: i * cardStep(), behavior: isReducedMotion ? "auto" : "smooth" });
      });
      frag.appendChild(dot);
      dotEls.push(dot);
    });
    dotsWrap.innerHTML = "";
    dotsWrap.appendChild(frag);
    updateDots();
  }
  function updateDots() {
    if (!dotEls.length) return;
    var step = cardStep();
    var idx = step ? Math.round(viewport.scrollLeft / step) : 0;
    idx = Math.max(0, Math.min(idx, dotEls.length - 1));
    dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
  }

  function renderCarousel(filter, animate) {
    var items = filteredProducts(filter).slice(0, 14);
    function doRender() {
      track.innerHTML = items.map(cardMarkup).join("");
      observeNew(track, ".product-card");
      viewport.scrollLeft = 0;
      renderDots();
      updateNavButtons();
    }
    if (animate && !isReducedMotion) {
      track.classList.add("is-switching");
      setTimeout(function () {
        doRender();
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { track.classList.remove("is-switching"); });
        });
      }, 240);
    } else {
      doRender();
    }
  }

  function renderGallery(filter) {
    if (!galleryGrid) return;
    var items = filteredProducts(filter);
    galleryGrid.innerHTML = items.map(galleryItemMarkup).join("");
    observeNew(galleryGrid, ".gallery-item");
  }

  function moveIndicator(btn) {
    if (!indicator || !btn) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }

  /* ---- filter switching ---- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-active")) return;
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      moveIndicator(btn);
      currentFilter = btn.getAttribute("data-filter");
      renderCarousel(currentFilter, true);
      if (galleryOpen) renderGallery(currentFilter);
    });
  });

  /* ---- carousel prev/next ---- */
  function scrollByCards(dir) {
    var card = track.querySelector(".product-card");
    var gap = 24;
    var amount = card ? (card.getBoundingClientRect().width + gap) * 2 : 320;
    viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { pauseAuto(); scrollByCards(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { pauseAuto(); scrollByCards(1); });
  viewport.addEventListener("scroll", function () { updateNavButtons(); }, { passive: true });

  /* ---- drag to scroll (desktop mouse) ---- */
  var isDown = false, startX = 0, startScroll = 0, dragMoved = false;
  viewport.addEventListener("mousedown", function (e) {
    isDown = true; dragMoved = false;
    viewport.classList.add("is-dragging");
    startX = e.pageX; startScroll = viewport.scrollLeft;
    pauseAuto();
  });
  window.addEventListener("mouseup", function () {
    isDown = false;
    viewport.classList.remove("is-dragging");
  });
  window.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    if (Math.abs(e.pageX - startX) > 4) dragMoved = true;
    viewport.scrollLeft = startScroll - (e.pageX - startX);
  });
  /* suppress accidental click-through after a real drag */
  viewport.addEventListener("click", function (e) {
    if (dragMoved) { e.stopPropagation(); dragMoved = false; }
  }, true);

  viewport.addEventListener("touchstart", function () { pauseAuto(); }, { passive: true });

  /* ---- auto-scroll, pausing intelligently on interaction ---- */
  function startAuto() {
    if (isReducedMotion || autoTimer || galleryOpen) return;
    autoTimer = setInterval(function () {
      if (viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4) {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        viewport.scrollBy({ left: cardStep(), behavior: "smooth" });
      }
    }, 3400);
  }
  function pauseAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, 5200);
  }
  if (carouselEl) {
    carouselEl.addEventListener("mouseenter", function () {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    });
    carouselEl.addEventListener("mouseleave", function () { if (!galleryOpen) startAuto(); });
  }

  /* ---- View All → expand into full gallery ---- */
  if (viewAllBtn && galleryWrap) {
    viewAllBtn.addEventListener("click", function () {
      galleryOpen = !galleryOpen;
      if (viewAllWrap) viewAllWrap.classList.toggle("is-expanded", galleryOpen);
      viewAllBtn.setAttribute("aria-expanded", galleryOpen ? "true" : "false");
      if (galleryOpen) {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        renderGallery(currentFilter);
        galleryWrap.hidden = false;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { galleryWrap.classList.add("is-open"); });
        });
        setTimeout(function () {
          galleryWrap.scrollIntoView({ behavior: isReducedMotion ? "auto" : "smooth", block: "nearest" });
        }, 120);
      } else {
        galleryWrap.classList.remove("is-open");
        setTimeout(function () { galleryWrap.hidden = true; }, isReducedMotion ? 0 : 650);
        startAuto();
      }
    });
  }

  /* ======================================================
     LIGHTBOX — premium image viewer
     ====================================================== */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxName = document.getElementById("lightboxName");
  var lightboxDesc = document.getElementById("lightboxDesc");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");
  var lbList = [];
  var lbIndex = 0;
  var lastFocused = null;

  function renderLightbox() {
    var p = lbList[lbIndex];
    if (!p || !lightboxImg) return;
    lightboxImg.src = p.image;
    lightboxImg.alt = p.name;
    if (lightboxName) lightboxName.textContent = p.name;
    if (lightboxDesc) lightboxDesc.textContent = p.desc;
  }
  function openLightbox(list, index) {
    if (!lightbox) return;
    lbList = list; lbIndex = index;
    renderLightbox();
    lastFocused = document.activeElement;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  function lbStep(dir) {
    if (!lbList.length) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    renderLightbox();
  }

  function bindOpeners(container) {
    if (!container) return;
    container.addEventListener("click", function (e) {
      var card = e.target.closest(".product-card, .gallery-item");
      if (!card || !container.contains(card)) return;
      var id = card.getAttribute("data-id");
      var list = filteredProducts(currentFilter);
      var idx = -1;
      for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
      if (idx === -1) return;
      openLightbox(list, idx);
    });
    container.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".product-card, .gallery-item");
      if (!card) return;
      e.preventDefault();
      card.click();
    });
  }
  bindOpeners(track);
  bindOpeners(galleryGrid);

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", function () { lbStep(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { lbStep(1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") lbStep(-1);
    else if (e.key === "ArrowRight") lbStep(1);
  });

  var touchStartX = null;
  if (lightbox) {
    lightbox.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) lbStep(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* ---- init ---- */
  renderCarousel(currentFilter, false);
  if (filterBtns.length) {
    setTimeout(function () {
      var active = filterWrap.querySelector(".is-active");
      moveIndicator(active);
    }, 80);
    window.addEventListener("resize", function () {
      var active = filterWrap.querySelector(".is-active");
      moveIndicator(active);
    });
  }
  var resizeSnapTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeSnapTimer);
    resizeSnapTimer = setTimeout(function () {
      var step = cardStep();
      if (step) viewport.scrollLeft = Math.round(viewport.scrollLeft / step) * step;
      updateDots();
    }, 150);
  });
  setTimeout(startAuto, 1400);
})();

/* ======================================================
   NAV — highlight the link for the section in view
   ====================================================== */
(function () {
  "use strict";
  var links = document.querySelectorAll(".nav__links a[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) map[id] = link;
  });
  var ids = Object.keys(map);
  if (!ids.length) return;
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove("is-active"); });
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  ids.forEach(function (id) { sectionObserver.observe(document.getElementById(id)); });
})();

/* ======================================================
   SIZE GUIDE — flip cards (hover on desktop, tap on
   mobile, keyboard accessible; CSS handles the
   prefers-reduced-motion crossfade fallback)
   ====================================================== */
(function () {
  "use strict";
  var cards = document.querySelectorAll(".flip-card");
  if (!cards.length) return;
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });
})();
