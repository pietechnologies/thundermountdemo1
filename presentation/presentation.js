/* Deck controls: scroll mode (default) and present mode (one slide per screen), keyboard navigation, print. */
(function () {
  'use strict';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var idx = 0; var body = document.body;
  var pos = document.getElementById('pos');
  function present(on) { body.classList.toggle('present', on); if (on) show(idx); updatePos(); document.getElementById('mode').textContent = on ? 'Scroll view' : 'Present'; }
  function show(i) { idx = Math.max(0, Math.min(slides.length - 1, i)); slides.forEach(function (s, n) { s.classList.toggle('active', n === idx); }); updatePos(); if (!body.classList.contains('present')) slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function updatePos() { pos.textContent = (idx + 1) + ' / ' + slides.length; }
  function currentInView() { var best = 0, bestD = Infinity; slides.forEach(function (s, n) { var d = Math.abs(s.getBoundingClientRect().top); if (d < bestD) { bestD = d; best = n; } }); return best; }
  document.getElementById('prev').onclick = function () { show((body.classList.contains('present') ? idx : currentInView()) - 1); };
  document.getElementById('next').onclick = function () { show((body.classList.contains('present') ? idx : currentInView()) + 1); };
  document.getElementById('mode').onclick = function () { idx = currentInView(); present(!body.classList.contains('present')); };
  document.getElementById('print').onclick = function () { window.print(); };
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); show((body.classList.contains('present') ? idx : currentInView()) + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show((body.classList.contains('present') ? idx : currentInView()) - 1); }
    if (e.key === 'f' || e.key === 'F') present(!body.classList.contains('present'));
    if (e.key === 'Escape' && body.classList.contains('present')) present(false);
    if (e.key === 'Home') show(0); if (e.key === 'End') show(slides.length - 1);
  });
  window.addEventListener('scroll', function () { if (!body.classList.contains('present')) { idx = currentInView(); updatePos(); } }, { passive: true });
  slides.forEach(function (s, n) { var el = s.querySelector('.num'); if (el) el.textContent = String(n + 1).padStart(2, '0') + ' / ' + slides.length; });
  updatePos();
  if (location.hash === '#present') present(true);
})();
