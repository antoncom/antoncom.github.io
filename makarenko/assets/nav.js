document.addEventListener('DOMContentLoaded', function () {
  var dd = document.getElementById('ddpol');
  if (dd) {
    var menu = dd.querySelector('.ddmenu');
    function place() { var r = dd.getBoundingClientRect(); var was = menu.style.display; menu.style.display = 'grid'; var w = menu.offsetWidth; menu.style.display = was; menu.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px'; }
    dd.addEventListener('mouseenter', place);
    dd.firstElementChild.addEventListener('click', function (e) {
      if (matchMedia('(hover: none)').matches) { e.preventDefault(); place(); dd.classList.toggle('open'); }
    });
    menu.addEventListener('click', function () { dd.classList.remove('open'); });
  }
  // highlight current section (only for in-page links)
  var links = {};
  document.querySelectorAll('.topnav a.sec').forEach(function (a) {
    var h = a.getAttribute('href');
    if (h && h.charAt(0) === '#' && document.getElementById(h.slice(1))) links[h.slice(1)] = a;
  });
  var heads = Object.keys(links).map(function (i) { return document.getElementById(i); });
  var cur0 = document.body.getAttribute('data-section');
  if (cur0) document.querySelectorAll('.topnav a.sec[data-s="' + cur0 + '"]').forEach(function (a) { a.classList.add('active'); });
  if (!heads.length) return;
  function mark() {
    var cur = null; heads.forEach(function (h) { if (h.getBoundingClientRect().top < 120) cur = h.id; });
    Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === cur); });
  }
  addEventListener('scroll', mark, { passive: true }); mark();
});
