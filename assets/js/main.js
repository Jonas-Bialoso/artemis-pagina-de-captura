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

  // Form: sem back-end (GitHub Pages é estático). Feedback local.
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
