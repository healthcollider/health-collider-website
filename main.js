// Mobile nav toggle - the site's only script. Progressive enhancement:
// with JS off the links are simply always visible (see CSS default at >860px)
// and on small screens the nav still renders as a stacked list on load.
(function () {
  var btn = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });
})();
