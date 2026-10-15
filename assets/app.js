(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('y').textContent = new Date().getFullYear();

  /* Project counts */
  document.querySelectorAll('[data-count-of]').forEach(function (el) {
    var n = document.querySelectorAll(el.dataset.countOf).length;
    el.textContent = (n < 10 ? '0' : '') + n;
  });

  /* Toast */
  var toast = document.getElementById('toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }


  /* Active nav link */
  var links = document.querySelectorAll('.links a');
  var sections = ['services', 'work', 'about', 'contact'].map(function (id) { return document.getElementById(id); });
  function onScroll() {
    var current = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s.id; });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
    lightWords();
  }

  /* Statement words light up on scroll */
  var wordBlocks = document.querySelectorAll('[data-words]');
  wordBlocks.forEach(function (el) {
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    })(el);
  });
  function lightWords() {
    wordBlocks.forEach(function (el) {
      var words = el.querySelectorAll('.w');
      var r = el.getBoundingClientRect();
      var p = reduce ? 1 : Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0), 1);
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* Reveal + counters */
  function countUp(el) {
    var end = +el.dataset.count;
    if (reduce) { el.textContent = end; return; }
    var start = performance.now(), dur = 1000;
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sib = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    el.style.setProperty('--d', (sib.indexOf(el) * 80) + 'ms');
    io.observe(el);
  });


  /* Liquid typer */
  var typer = document.getElementById('typer');
  var snippets = ['{% section %}', '{{ product.title }}', '{% for item in cart %}', '{{ price | money }}', "{% render 'card' %}"];
  if (!reduce) {
    var si = 0, ci = snippets[0].length, deleting = true;
    (function type() {
      if (deleting) {
        ci--;
        if (ci <= 0) { deleting = false; si = (si + 1) % snippets.length; }
      } else {
        ci++;
        if (ci >= snippets[si].length) { deleting = true; typer.textContent = snippets[si]; return setTimeout(type, 1600); }
      }
      typer.textContent = snippets[si].slice(0, Math.max(ci, 0)) || '​';
      setTimeout(type, deleting ? 35 : 70);
    })();
  }

  /* Copy email */
  var copy = document.getElementById('copy');
  copy.addEventListener('click', function () {
    var email = copy.dataset.email;
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () { showToast('Email copied'); }, function () { showToast(email); });
    else showToast(email);
  });
})();
