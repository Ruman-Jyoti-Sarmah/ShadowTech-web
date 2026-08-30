/* ============================================================
   scroll-reveal.js — Subtle 3D entrance for content as it
   scrolls into view. Used by index1.html and index2.html.

   Elements marked with [data-reveal] start slightly rotated /
   translated in 3D space and settle into place with a staggered
   delay when they enter the viewport.
   ============================================================ */

(function () {
    'use strict';

    // Respect reduced-motion preferences: show everything immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;

                // Stagger siblings so grids cascade into view (max 5 steps).
                var siblings = el.parentElement.querySelectorAll('[data-reveal]');
                var idx = Array.prototype.indexOf.call(siblings, el);
                el.style.transitionDelay = Math.min(idx, 5) * 0.08 + 's';

                el.classList.add('in-view');
                io.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) {
        io.observe(el);
    });
})();