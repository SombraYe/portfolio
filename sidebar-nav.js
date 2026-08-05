/* ============================================================
   TWO-LEVEL NAV BEHAVIOR — Xiaoyu Ye Portfolio Site
   ============================================================
   Handles:
   1. Click a level-1 project title -> expand its sub-list
      (accordion: only one project expanded at a time).
   2. Click a level-2 sub-link -> smooth scroll to that section.
   3. Scroll-spy: as the user scrolls, automatically mark the
      project + sub-section currently in view as "active"/"current"
      and auto-expand that project's sub-list, so the sidebar
      always reflects where the reader actually is.

   Requires each project's content wrapper to have a matching
   data-project attribute, and each sub-section to have the id
   referenced by its nav-sub-link's href (see CSS file's markup
   comment for the expected nav structure).

   Example content markup this expects:
   <section id="breezy-overview" data-project="breezy">...</section>
   <section id="breezy-research" data-project="breezy">...</section>
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const navProjects = document.querySelectorAll('.nav-project');
  const subLinks = document.querySelectorAll('.nav-sub-link');

  // ---------- 1. Click to expand/collapse a project (accordion) ----------
  navProjects.forEach((project) => {
    const toggle = project.querySelector('.nav-project-toggle');
    toggle.addEventListener('click', () => {
      const wasExpanded = project.classList.contains('is-expanded');
      navProjects.forEach((p) => p.classList.remove('is-expanded'));
      if (!wasExpanded) {
        project.classList.add('is-expanded');
      }
    });
  });

  // ---------- 2. Smooth scroll on sub-link click ----------
  subLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- 3. Scroll-spy: highlight current section ----------
  const sections = document.querySelectorAll('section[id][data-project]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.id;
        const projectKey = entry.target.dataset.project;

        // Mark the matching sub-link as current
        subLinks.forEach((link) => {
          link.classList.toggle(
            'is-current',
            link.getAttribute('href') === `#${sectionId}`
          );
        });

        // Mark the matching project as active + auto-expand it
        navProjects.forEach((project) => {
          const isMatch = project.dataset.project === projectKey;
          project.classList.toggle('is-active', isMatch);
          if (isMatch) {
            project.classList.add('is-expanded');
          }
        });
      });
    },
    {
      // Fires when a section crosses the vertical center of the
      // viewport — tune rootMargin if sections trigger too early/late.
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
});
