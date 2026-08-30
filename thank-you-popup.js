/* ============================================================
   ShadowTechX — Premium 3D "Thank You" Popup
   Reusable, self-contained. No dependencies. CSS/SVG only.

   Shown ONLY after EmailJS confirms a successful send
   (called from script1.js via window.ShadowPopup.open()).

   API: window.ShadowPopup.open() / window.ShadowPopup.close()
   ============================================================ */
(function () {
    'use strict';

    var overlay = null;
    var modal = null;
    var lastFocused = null;
    var isOpen = false;
    var closeTimer = null;

    function ensureMarkup() {
        if (document.getElementById('ty-overlay')) {
            overlay = document.getElementById('ty-overlay');
            modal = overlay.querySelector('.ty-modal');
            return;
        }

        overlay = document.createElement('div');
        overlay.id = 'ty-overlay';
        overlay.hidden = true;
        overlay.innerHTML =
            '<div class="ty-backdrop" aria-hidden="true">' +
                '<span class="ty-glow ty-glow-blue"></span>' +
                '<span class="ty-glow ty-glow-purple"></span>' +
            '</div>' +
            '<div class="ty-scene">' +
                '<div class="ty-modal" role="dialog" aria-modal="true" aria-labelledby="ty-title" aria-describedby="ty-lead" tabindex="-1">' +
                    '<button type="button" class="ty-close" aria-label="Close popup">&times;</button>' +
                    '<div class="ty-icon" aria-hidden="true">' +
                        '<svg class="ty-check" viewBox="0 0 52 52" aria-hidden="true" focusable="false">' +
                            '<defs>' +
                                '<linearGradient id="ty-check-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                                    '<stop offset="0%" stop-color="#2563eb"/>' +
                                    '<stop offset="100%" stop-color="#7c3aed"/>' +
                                '</linearGradient>' +
                            '</defs>' +
                            '<circle class="ty-check-ring" cx="26" cy="26" r="23" fill="none" stroke="url(#ty-check-grad)"/>' +
                            '<path class="ty-check-mark" fill="none" stroke="url(#ty-check-grad)" d="M15 27.5l7.5 7.5L37.5 18"/>' +
                        '</svg>' +
                    '</div>' +
                    '<h3 class="ty-title" id="ty-title">Thank You!</h3>' +
                    '<p class="ty-lead" id="ty-lead">Your consultation request has been sent successfully.</p>' +
                    '<p class="ty-sub">Our team will review your project details and get back to you soon.</p>' +
                    '<button type="button" class="ty-continue">Continue</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);
        modal = overlay.querySelector('.ty-modal');

        overlay.querySelector('.ty-close').addEventListener('click', close);
        overlay.querySelector('.ty-continue').addEventListener('click', close);
        overlay.querySelector('.ty-backdrop').addEventListener('click', close);

        // ESC closes the popup; Tab is trapped inside the dialog.
        document.addEventListener('keydown', function (e) {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            } else if (e.key === 'Tab') {
                trapFocus(e);
            }
        });
    }

    function getFocusable() {
        return modal ? modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])') : [];
    }

    function trapFocus(e) {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function open() {
        if (isOpen || !overlay) return;
        isOpen = true;
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        lastFocused = document.activeElement;
        overlay.hidden = false;
        // Force a reflow so the entrance transition/animation replays.
        void overlay.offsetWidth;
        overlay.classList.add('ty-open');
        document.body.style.overflow = 'hidden';
        var btn = overlay.querySelector('.ty-continue');
        if (btn) btn.focus();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        overlay.classList.add('ty-closing');
        closeTimer = setTimeout(function () {
            closeTimer = null;
            overlay.classList.remove('ty-open', 'ty-closing');
            overlay.hidden = true;
            document.body.style.overflow = '';
            if (lastFocused && lastFocused.focus) lastFocused.focus();
        }, 320);
    }

    document.addEventListener('DOMContentLoaded', ensureMarkup);
    if (document.readyState !== 'loading') ensureMarkup();

    window.ShadowPopup = { open: open, close: close };
})();
