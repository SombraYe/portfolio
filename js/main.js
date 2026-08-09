// Hero readout: one orchestrated load-in, echoing Breezy's own telemetry UI.
(function () {
  var readout = document.getElementById('readout');
  if (!readout) return;

  var values = readout.querySelectorAll('.readout-value');

  function typeIn(el, text, speed) {
    el.textContent = '';
    var i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      }
    })();
  }

  function run() {
    values.forEach(function (el, idx) {
      setTimeout(function () {
        typeIn(el, el.dataset.value, 14);
      }, idx * 260);
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    values.forEach(function (el) { el.textContent = el.dataset.value; });
  } else {
    setTimeout(run, 300);
  }
})();

// Project sidebar nav: accordion expand + scroll-spy active state.
(function () {
  var navProjects = document.querySelectorAll('.nav-project');
  if (!navProjects.length) return;

  var subLinks = document.querySelectorAll('.nav-sub-link');
  var projectStartByKey = {
    healthcare: 'breezy-overview',
    spatial: 'spatial-light-house',
    other: 'other',
    experience: 'about'
  };

  function goToProjectStart(project) {
    var targetId = projectStartByKey[project.dataset.project];
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '#' + targetId);
    }
  }

  // Click a project title to expand it and jump to its start; repeated clicks only jump.
  navProjects.forEach(function (project) {
    var toggle = project.querySelector('.nav-project-toggle');
    if (toggle.tagName === 'BUTTON') {
      toggle.addEventListener('click', function () {
        var wasExpanded = project.classList.contains('is-expanded');
        if (wasExpanded) {
          goToProjectStart(project);
          return;
        }

        navProjects.forEach(function (p) {
          p.classList.remove('is-expanded');
          var pToggle = p.querySelector('.nav-project-toggle');
          if (pToggle && pToggle.tagName === 'BUTTON') pToggle.setAttribute('aria-expanded', 'false');
        });
        project.classList.add('is-expanded');
        toggle.setAttribute('aria-expanded', 'true');
        goToProjectStart(project);
      });
    }
  });

  // Scroll-spy: mark the project + sub-section currently in view.
  var sections = document.querySelectorAll('[id][data-project]');
  if (!('IntersectionObserver' in window) || !sections.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var sectionId = entry.target.id;
        var projectKey = entry.target.dataset.project;

        subLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + sectionId);
        });

        navProjects.forEach(function (project) {
          var isMatch = project.dataset.project === projectKey;
          project.classList.toggle('is-active', isMatch);
          project.classList.toggle('is-expanded', isMatch);
          var toggle = project.querySelector('.nav-project-toggle');
          if (toggle && toggle.tagName === 'BUTTON') {
            toggle.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
          }
          if (isMatch) {
            project.classList.add('is-expanded');
          }
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();

// Scroll reveal: single quiet fade-up per section, not per-element noise.
(function () {
  var targets = document.querySelectorAll(
    '.tracks-inner, .case-header, .case-award, .case-grid, .deep-cols, .timeline-list, .edu-skills, .contact-inner'
  );
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(function (t) { t.classList.add('reveal', 'is-visible'); });
    return;
  }
  targets.forEach(function (t) { t.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(function (t) { io.observe(t); });
})();
