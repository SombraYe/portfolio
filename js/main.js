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

// Shared full-screen viewer for case-study images.
(function () {
  var dialog = document.querySelector('.image-viewer');
  if (!dialog || !dialog.showModal) return;

  var stage = dialog.querySelector('.image-viewer-stage');
  var image = dialog.querySelector('.image-viewer-image');
  var closeButton = dialog.querySelector('.image-viewer-close');
  var scale = 1;
  var panX = 0;
  var panY = 0;
  var dragging = false;
  var dragX = 0;
  var dragY = 0;
  var opener = null;
  var previousOverflow = '';

  function render() {
    image.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    image.classList.toggle('is-zoomed', scale > 1);
  }

  function clampPan() {
    var styles = window.getComputedStyle(stage);
    var availableWidth = stage.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    var availableHeight = stage.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    var maxX = Math.max(0, (image.offsetWidth * scale - availableWidth) / 2);
    var maxY = Math.max(0, (image.offsetHeight * scale - availableHeight) / 2);
    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxY, Math.max(-maxY, panY));
  }

  function openImage(source, button) {
    opener = button;
    scale = 1;
    panX = 0;
    panY = 0;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    render();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeButton.focus();
  }

  document.querySelectorAll('.case img').forEach(function (source) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-image-button';
    button.setAttribute('aria-label', 'View larger image: ' + source.alt);
    button.setAttribute('aria-haspopup', 'dialog');
    source.parentNode.insertBefore(button, source);
    button.appendChild(source);
    button.addEventListener('click', function () { openImage(source, button); });
  });

  dialog.addEventListener('wheel', function (event) {
    event.preventDefault();
    var delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    var nextScale = Math.min(5, Math.max(1, scale * Math.exp(-delta * 0.0015)));
    if (nextScale === scale) return;

    var rect = image.getBoundingClientRect();
    var centerX = (rect.left + rect.right) / 2 - panX;
    var centerY = (rect.top + rect.bottom) / 2 - panY;
    panX = event.clientX - centerX - (event.clientX - centerX - panX) * nextScale / scale;
    panY = event.clientY - centerY - (event.clientY - centerY - panY) * nextScale / scale;
    scale = nextScale;
    clampPan();
    render();
  }, { passive: false });

  image.addEventListener('pointerdown', function (event) {
    if (scale <= 1) return;
    event.preventDefault();
    dragging = true;
    dragX = event.clientX - panX;
    dragY = event.clientY - panY;
    image.classList.add('is-dragging');
    image.setPointerCapture(event.pointerId);
  });
  image.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    panX = event.clientX - dragX;
    panY = event.clientY - dragY;
    clampPan();
    render();
  });
  function stopDragging() {
    dragging = false;
    image.classList.remove('is-dragging');
  }
  image.addEventListener('pointerup', stopDragging);
  image.addEventListener('pointercancel', stopDragging);
  image.addEventListener('lostpointercapture', stopDragging);

  closeButton.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target === stage) dialog.close();
  });
  dialog.addEventListener('close', function () {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    image.alt = '';
    stopDragging();
    if (opener) opener.focus({ preventScroll: true });
    opener = null;
  });
  window.addEventListener('resize', function () {
    if (!dialog.open) return;
    clampPan();
    render();
  });
})();

// Project sidebar nav: accordion expand + scroll-spy active state.
(function () {
  var navProjects = document.querySelectorAll('.nav-project');
  if (!navProjects.length) return;

  var subLinks = document.querySelectorAll('.nav-sub-link');
  var projectStartByKey = {
    healthcare: 'breezy-overview',
    spatial: 'spatial-flora-transit',
    other: 'other',
    experience: 'about'
  };
  var programmaticScroll = {
    active: false,
    targetId: '',
    token: 0,
    settleTimer: null,
    failsafeTimer: null
  };

  function navOffset() {
    var nav = document.getElementById('nav');
    var offset = (nav ? nav.getBoundingClientRect().height : 0) + 28;
    var projectNav = document.querySelector('.project-nav');
    if (window.matchMedia('(max-width: 900px)').matches && projectNav) {
      offset += projectNav.getBoundingClientRect().height;
    }
    return offset;
  }

  function scrollToSection(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return false;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function targetTop() {
      return target.getBoundingClientRect().top + window.pageYOffset - navOffset();
    }

    startProgrammaticScroll(targetId);

    window.scrollTo({
      top: Math.max(0, targetTop()),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '#' + targetId);
    }
    if (prefersReducedMotion) finishProgrammaticScroll(programmaticScroll.token);
    return true;
  }

  function projectForTarget(targetId) {
    var target = document.getElementById(targetId);
    return target ? target.dataset.project : '';
  }

  function setActiveNav(projectKey, sectionId) {
    if (!projectKey) return;

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
    });
  }

  function startProgrammaticScroll(targetId) {
    programmaticScroll.token += 1;
    programmaticScroll.active = true;
    programmaticScroll.targetId = targetId;
    clearTimeout(programmaticScroll.settleTimer);
    clearTimeout(programmaticScroll.failsafeTimer);

    setActiveNav(projectForTarget(targetId), targetId);

    var token = programmaticScroll.token;
    programmaticScroll.failsafeTimer = setTimeout(function () {
      finishProgrammaticScroll(token);
    }, 1600);
  }

  function finishProgrammaticScroll(token) {
    if (token !== programmaticScroll.token) return;
    clearTimeout(programmaticScroll.settleTimer);
    clearTimeout(programmaticScroll.failsafeTimer);
    setActiveNav(projectForTarget(programmaticScroll.targetId), programmaticScroll.targetId);
    programmaticScroll.active = false;
  }

  window.addEventListener('scroll', function () {
    if (!programmaticScroll.active) return;
    var token = programmaticScroll.token;
    clearTimeout(programmaticScroll.settleTimer);
    programmaticScroll.settleTimer = setTimeout(function () {
      finishProgrammaticScroll(token);
    }, 180);
  }, { passive: true });

  function goToProjectStart(project) {
    var targetId = projectStartByKey[project.dataset.project];
    if (!targetId) return;
    scrollToSection(targetId);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      if (scrollToSection(targetId)) event.preventDefault();
    });
  });

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
      if (programmaticScroll.active) return;

      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var sectionId = entry.target.id;
        var projectKey = entry.target.dataset.project;

        setActiveNav(projectKey, sectionId);
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
