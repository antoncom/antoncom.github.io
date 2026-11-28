document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.topnav .dd').forEach(function (dd) {
    var menu = dd.querySelector('.ddmenu');
    var right = dd.classList.contains('langdd');
    function place() {
      var r = dd.getBoundingClientRect(); var was = menu.style.display; menu.style.display = 'grid';
      var w = menu.offsetWidth; menu.style.display = was;
      var left = right ? r.right - w : r.left;
      menu.style.left = Math.max(8, Math.min(left, innerWidth - w - 8)) + 'px'; menu.style.right = 'auto';
    }
    dd.addEventListener('mouseenter', place);
    dd.firstElementChild.addEventListener('click', function (e) {
      if (matchMedia('(hover: none)').matches) {
        e.preventDefault(); place();
        document.querySelectorAll('.topnav .dd.open').forEach(function (o) { if (o !== dd) o.classList.remove('open'); });
        dd.classList.toggle('open');
      }
    });
    menu.addEventListener('click', function () { dd.classList.remove('open'); });
  });
  var links = {};
  document.querySelectorAll('.topnav a.sec').forEach(function (a) {
    var h = a.getAttribute('href');
    if (h && h.charAt(0) === '#' && document.getElementById(h.slice(1))) links[h.slice(1)] = a;
  });
  var cur0 = document.body.getAttribute('data-section');
  if (cur0) document.querySelectorAll('.topnav a.sec[data-s="' + cur0 + '"]').forEach(function (a) { a.classList.add('active'); });
  var heads = Object.keys(links).map(function (i) { return document.getElementById(i); });
  if (!heads.length) return;
  function mark() {
    var cur = null; heads.forEach(function (h) { if (h.getBoundingClientRect().top < 120) cur = h.id; });
    Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === cur); });
  }
  addEventListener('scroll', mark, { passive: true }); mark();
});
