/* Artemis · Página de Captura — interações leves */
(function () {
  "use strict";

  // Smooth scroll para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Motion: revela blocos ao entrar na tela e conta os numeros.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealItems = document.querySelectorAll([
    ".hero__text",
    ".hero__item",
    ".form",
    ".reviews__text",
    ".review-card",
    ".diag__head",
    ".diag-card",
    ".stat",
    ".cta__status > *",
    ".cta__content"
  ].join(","));

  revealItems.forEach(function (item, index) {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 70 + "ms");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  function parseStatValue(text) {
    var match = text.match(/^([^0-9]*)([0-9]+(?:[,.][0-9]+)?)(.*)$/);
    if (!match) return null;
    var decimalPart = match[2].split(/[,.]/)[1];
    return {
      prefix: match[1],
      value: Number(match[2].replace(",", ".")),
      suffix: match[3],
      decimals: decimalPart ? decimalPart.length : 0,
      comma: match[2].indexOf(",") > -1
    };
  }

  function formatStatValue(stat, value) {
    var number = value.toFixed(stat.decimals);
    if (stat.comma) number = number.replace(".", ",");
    return stat.prefix + number + stat.suffix;
  }

  function animateStat(el) {
    if (el.dataset.counted === "true") return;
    var stat = el._stat || parseStatValue(el.textContent.trim());
    if (!stat) return;
    el.dataset.counted = "true";

    if (reduceMotion) {
      el.textContent = formatStatValue(stat, stat.value);
      return;
    }

    var start = null;
    var duration = 2200;
    function tick(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatStatValue(stat, stat.value * eased);
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        el.textContent = formatStatValue(stat, stat.value);
      }
    }
    window.requestAnimationFrame(tick);
  }

  var statNumbers = document.querySelectorAll(".stat__num");
  statNumbers.forEach(function (num) {
    var stat = parseStatValue(num.textContent.trim());
    if (!stat) return;
    num._stat = stat;
    if (!reduceMotion) {
      num.textContent = formatStatValue(stat, 0);
    }
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    statNumbers.forEach(animateStat);
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateStat(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    statNumbers.forEach(function (num) {
      countObserver.observe(num);
    });
  }

  function renderPatternStrip(strip) {
    var width = Math.ceil(strip.getBoundingClientRect().width);
    if (!width) return;
    var isDiagPattern = strip.classList.contains("pattern-strip--diag");
    var step = isDiagPattern ? 16.659 : 16.952;
    var pathW = 24;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " 64");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    var count = Math.ceil(width / step) + 3;
    for (var i = -1; i < count; i += 1) {
      var x = i * step;
      var line = document.createElementNS(svgNS, "path");
      line.setAttribute("d", "M" + (x + pathW).toFixed(3) + " 0.176L" + x.toFixed(3) + " 64.176");
      line.setAttribute("stroke", "white");
      line.setAttribute("stroke-opacity", "0.15");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      svg.appendChild(line);
    }

    strip.replaceChildren(svg);
  }

  var patternStrips = document.querySelectorAll(".pattern-strip");
  patternStrips.forEach(renderPatternStrip);

  var patternResizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(patternResizeTimer);
    patternResizeTimer = window.setTimeout(function () {
      patternStrips.forEach(renderPatternStrip);
    }, 120);
  });

  function enhanceCtaPattern(wrap) {
    var svg = wrap.querySelector("svg");
    if (!svg) return;
    var shapes = svg.querySelectorAll("path, line");
    var viewBox = svg.viewBox && svg.viewBox.baseVal;
    var width = viewBox && viewBox.width ? viewBox.width : shapes.length;

    shapes.forEach(function (shape, index) {
      var x = shapes.length > 1 ? index / (shapes.length - 1) : 0;
      if (shape.getBBox && viewBox && viewBox.width) {
        try {
          x = Math.max(0, Math.min(1, shape.getBBox().x / width));
        } catch (error) {}
      }

      var variant = index % 4 === 0 ? "bright" : (index % 4 === 1 ? "faint" : "soft");
      var jitter = ((index * 17) % 13 - 6) / 220;
      shape.classList.add("ctaf-tick", "ctaf-tick--" + variant);
      shape.style.setProperty("--x", x.toFixed(4));
      shape.style.setProperty("--j", jitter.toFixed(4));
    });
  }

  document.querySelectorAll("[data-svg-src]").forEach(function (wrap) {
    var src = wrap.getAttribute("data-svg-src");
    if (!src) return;

    window.fetch(src)
      .then(function (response) {
        if (!response.ok) throw new Error("CTA SVG not found");
        return response.text();
      })
      .then(function (svg) {
        wrap.innerHTML = svg;
        window.requestAnimationFrame(function () {
          enhanceCtaPattern(wrap);
        });
      })
      .catch(function () {
        wrap.hidden = true;
      });
  });

  // Feedback local do formulario estatico.
  var form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Enviando…";
      window.setTimeout(function () {
        btn.textContent = "Recebemos! Vamos te chamar ✓";
        window.setTimeout(function () {
          btn.disabled = false;
          btn.innerHTML = original;
          form.reset();
        }, 2600);
      }, 700);
    });
  }
})();
