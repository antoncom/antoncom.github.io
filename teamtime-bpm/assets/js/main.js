// TeamTime BPM — поведение страницы
(function () {
  var nav = document.querySelector('.nav');
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav ul.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });
  }

  // Закрывать список языков при клике вне его
  var ls = document.querySelector('.lang-switch');
  if (ls) document.addEventListener('click', function (e) { if (!ls.contains(e.target)) ls.removeAttribute('open'); });

  // Подсветка пункта меню текущей секции
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav ul.menu a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  // Появление блоков при прокрутке
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Вкладки модулей
  var tabs = document.querySelectorAll('.mod-tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.mod-panel').forEach(function (p) { p.classList.remove('active'); });
      t.classList.add('active'); t.setAttribute('aria-selected', 'true');
      var p = document.getElementById(t.dataset.target);
      if (p) p.classList.add('active');
    });
  });

  // Лайтбокс для скриншотов
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.shot img').forEach(function (img) {
    img.addEventListener('click', function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); });
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
})();
