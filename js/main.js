/* ================================================================
   粤味·广东美食网  |  全站公共脚本（原生 JS，无依赖）
   ================================================================ */
(function () {
  "use strict";

  /* ---------- 1. 导航：滚动变色 + 高亮当前页 ---------- */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 500);

    // Hero 视差
    var bg = document.querySelector(".hero__bg");
    if (bg && y < window.innerHeight * 1.2) {
      bg.style.transform = "translateY(" + (y * 0.35) + "px) scale(1.06)";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 当前页面导航高亮
  var current = window.location.pathname.split("/").pop() || "index.htm";
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page") === current) a.classList.add("active");
  });

  /* ---------- 2. 移动端菜单 ---------- */
  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", hamburger.classList.contains("open") ? "true" : "false");
    });
    // 点击链接后收起
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- 3. 回到顶部 ---------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 4. 滚动渐显（IntersectionObserver） ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 5. 数字滚动计数 ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    function runCounter(el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 6. Hero 图片轮播（首页） ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 5000);
  }

  /* ---------- 7. 菜品筛选（名菜页） ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var filterItems = document.querySelectorAll("[data-category]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-filter");
      filterItems.forEach(function (item) {
        var show = cat === "all" || item.getAttribute("data-category") === cat;
        item.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- 8. 折叠问答（早茶页） ---------- */
  var accItems = document.querySelectorAll(".acc__head");
  accItems.forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".acc.open").forEach(function (i) { i.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- 9. 灯箱画廊（美食街页） ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox__cap");
    var galleryItems = document.querySelectorAll("[data-gallery]");
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        lbImg.src = img.src;
        lbCap.textContent = item.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox__close")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLb();
    });
  }

  /* ---------- 10. 联系表单校验 ---------- */
  var form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var msg = form.querySelector("#message");

      function setErr(id, show) {
        var el = form.querySelector(id);
        if (el) el.classList.toggle("show", show);
      }

      // 严格类型比较与空值判断
      if (name && name.value.trim() === "") { setErr("#err-name", true); ok = false; }
      else setErr("#err-name", false);

      if (email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.value.trim())) { setErr("#err-email", true); ok = false; }
        else setErr("#err-email", false);
      }
      if (msg && msg.value.trim() === "") { setErr("#err-msg", true); ok = false; }
      else setErr("#err-msg", false);

      var okBox = form.querySelector("#formOk");
      if (ok) {
        if (okBox) okBox.classList.add("show");
        form.reset();
      } else if (okBox) {
        okBox.classList.remove("show");
      }
    });
  }
})();
