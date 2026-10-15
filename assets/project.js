(function () {
  var root = document.documentElement;
  document.getElementById('y').textContent = new Date().getFullYear();


  /* Reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sib = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    el.style.setProperty('--d', (sib.indexOf(el) * 70) + 'ms');
    io.observe(el);
  });

  /* Before / after sliders */
  document.querySelectorAll('.ba').forEach(function (fig) {
    var range = fig.querySelector('.ba-range');
    function set(v) { fig.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
  });
})();
