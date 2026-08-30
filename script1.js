document.addEventListener('DOMContentLoaded', () => {
    // Navbar shadow enhancement on scroll
    const header = document.getElementById('main-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', (window.pageYOffset || window.scrollY) > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- EmailJS configuration (frontend-only) ---
    // Enter YOUR OWN EmailJS credentials here (all three are public values, safe for the frontend):
    //   serviceId  -> EmailJS Dashboard > Email Services (e.g. "service_xxxxxxx")
    //   templateId -> EmailJS Dashboard > Email Templates (e.g. "template_xxxxxxx")
    //   publicKey  -> EmailJS Dashboard > Account > API Keys (Public Key)
    const EMAILJS_CONFIG = {
        serviceId: 'service_ntjejqp',
        templateId: 'template_szfvkef',
        publicKey: 'pVOMsG5Rfc_VcdpA5'
    };

    const form = document.getElementById('contact-form');
    const messageElement = document.getElementById('form-message');

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    function setMenu(open) {
        sidebar.classList.toggle('active', open);
        hamburger.classList.toggle('open', open);
    }

    hamburger.addEventListener('click', () => {
        setMenu(!sidebar.classList.contains('active'));
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            setMenu(false);
        }
    });

    // Close sidebar when clicking a link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenu(false);
      });
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      item.addEventListener('click', () => {
        // Close other open FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle the clicked item
        item.classList.toggle('active');
      });
    });

    if (!form) {
        console.error('Contact form element not found (ID: contact-form)');
        return;
    }

    function showMessage(text, type = 'info') {
        messageElement.textContent = text;
        messageElement.classList.remove('form-message-hidden', 'form-message-success', 'form-message-error');
        if (type === 'success') {
            messageElement.classList.add('form-message-success');
        } else if (type === 'error') {
            messageElement.classList.add('form-message-error');
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const sending = submitButton.dataset.sending === 'true';

        // Prevent multiple submissions while an email is in flight
        if (sending) return;

        const restoreButton = () => {
            submitButton.disabled = false;
            submitButton.dataset.sending = 'false';
            submitButton.textContent = 'Launch Consultation';
        };

        // Collect form data — keys MUST match the variables used in the
        // EmailJS template: {{name}}, {{email}}, {{phone}}, {{message}}, {{time}}
        const websiteName = form.querySelector('#website-name').value.trim();
        const formData = {
            name: form.querySelector('#full-name').value.trim(),
            email: form.querySelector('#professional-email').value.trim(),
            phone: form.querySelector('#phone-number') ? form.querySelector('#phone-number').value.trim() : '',
            message: (websiteName ? 'Website/App: ' + websiteName + '\n\n' : '') +
                     form.querySelector('#project-details').value.trim(),
            time: new Date().toLocaleString()
        };

        // Client-side validation
        const missing = [];
        if (!formData.name) missing.push('Full Name');
        if (!formData.email) missing.push('Professional Email');
        if (!websiteName) missing.push('Website / Mobile App name');
        if (!formData.message) missing.push('Project Details');

        if (missing.length > 0) {
            showMessage('Please fill in required fields: ' + missing.join(', ') + '.', 'error');
            restoreButton();
            return;
        }

        // Email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            restoreButton();
            return;
        }

        // Check that EmailJS credentials have been filled in
        if (EMAILJS_CONFIG.serviceId.startsWith('YOUR_') ||
            EMAILJS_CONFIG.templateId.startsWith('YOUR_') ||
            EMAILJS_CONFIG.publicKey.startsWith('YOUR_')) {
            showMessage('Email service is not configured yet. Please contact us directly.', 'error');
            console.error('EmailJS credentials missing in script1.js (EMAILJS_CONFIG).');
            restoreButton();
            return;
        }

        // Guard: the EmailJS SDK is loaded from a CDN in index1.html.
        // If it failed to load (offline, CDN blocked), fail gracefully
        // instead of crashing inside emailjs.send().
        if (typeof emailjs === 'undefined') {
            showMessage('Email service could not be loaded. Please check your connection and try again.', 'error');
            console.error('EmailJS SDK not loaded — check the CDN script tag in index1.html.');
            restoreButton();
            return;
        }

        // Loading state
        submitButton.dataset.sending = 'true';
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // --- TEMPORARY DEBUG LOGGING (remove once the form works) ---
        console.log('[EmailJS DEBUG] serviceId  =', JSON.stringify(EMAILJS_CONFIG.serviceId));
        console.log('[EmailJS DEBUG] templateId =', JSON.stringify(EMAILJS_CONFIG.templateId));
        console.log('[EmailJS DEBUG] publicKey present =', Boolean(EMAILJS_CONFIG.publicKey), '(length:', (EMAILJS_CONFIG.publicKey || '').length + ')');
        console.log('[EmailJS DEBUG] template param keys =', Object.keys(formData));
        console.log('[EmailJS DEBUG] EmailJS SDK version =', (emailjs && emailjs.version) ? emailjs.version : 'unknown');

        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,   // arg 1: serviceId
                EMAILJS_CONFIG.templateId,  // arg 2: templateId
                formData,                   // arg 3: templateParams
                { publicKey: EMAILJS_CONFIG.publicKey } // arg 4: options
            );

            submitButton.textContent = 'Consultation Request Sent ✓';
            form.reset();
            // EmailJS confirmed success — show the 3D Thank You popup
            if (window.ShadowPopup) window.ShadowPopup.open();
        } catch (err) {
            console.error('EmailJS send failed:', err);
            // Surface the real reason EmailJS rejected the request so it
            // can be debugged (404 = wrong Service/Template ID, 401/403 =
            // wrong Public Key or service not connected, 429 = quota).
            const reason = (err && (err.text || err.message)) || 'Unknown error';
            const status = err && err.status ? ' (status ' + err.status + ')' : '';
            console.error('EmailJS error details:', reason + status);
            submitButton.textContent = 'Try Again';
            showMessage('Something went wrong while submitting your request. ' + reason + status, 'error');
        } finally {
            // Keep the success/error label visible briefly, then restore normal state
            setTimeout(restoreButton, 2500);
            setTimeout(() => messageElement.classList.add('form-message-hidden'), 7000);
        }
    });

    // --- Pricing Mobile Swipe Dots (native CSS scroll, JS only syncs dots) ---
    const pricingGrid = document.querySelector('.pricing-grid');
    const pricingDotsWrap = document.getElementById('pricing-dots');

    if (pricingGrid && pricingDotsWrap) {
        const priceCards = pricingGrid.querySelectorAll('.price-card');

        // Build one dot per pricing card (only 3 — Startup / Growth / Empire)
        priceCards.forEach((card, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'pricing-dot';
            dot.setAttribute('aria-label', 'Go to pricing plan ' + (i + 1));
            dot.addEventListener('click', () => {
                const left = card.offsetLeft - (pricingGrid.clientWidth - card.clientWidth) / 2;
                pricingGrid.scrollTo({ left: left, behavior: 'smooth' });
            });
            pricingDotsWrap.appendChild(dot);
        });
        const priceDots = pricingDotsWrap.querySelectorAll('.pricing-dot');

        // Highlight the dot of the card closest to the viewport centre
        function updatePricingDots() {
            const center = pricingGrid.scrollLeft + pricingGrid.clientWidth / 2;
            let closest = 0;
            let best = Infinity;
            priceCards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.clientWidth / 2;
                const dist = Math.abs(cardCenter - center);
                if (dist < best) { best = dist; closest = i; }
            });
            priceDots.forEach((d, i) => d.classList.toggle('active', i === closest));
        }

        pricingGrid.addEventListener('scroll', updatePricingDots, { passive: true });
        updatePricingDots();
    }

    // --- Premium Horizontal Services Carousel ---
    const scroller = document.getElementById('services-scroller');
    const prevBtn = document.getElementById('services-prev');
    const nextBtn = document.getElementById('services-next');
    const dotsWrap = document.getElementById('services-dots');

    if (scroller && prevBtn && nextBtn && dotsWrap) {
        const slides = scroller.querySelectorAll('.service-slide');
        const total = slides.length;
        let activeIdx = 0;

        // Generate dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'services-dot';
            dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }
        const dots = dotsWrap.querySelectorAll('.services-dot');

        function update() {
            slides.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
            dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
            prevBtn.disabled = activeIdx === 0;
            nextBtn.disabled = activeIdx === total - 1;
        }

        function goTo(i) {
            activeIdx = Math.max(0, Math.min(total - 1, i));
            const slide = slides[activeIdx];
            const left = slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2;
            scroller.scrollTo({ left: left, behavior: 'smooth' });
            update();
        }

        prevBtn.addEventListener('click', () => goTo(activeIdx - 1));
        nextBtn.addEventListener('click', () => goTo(activeIdx + 1));

        // Update active based on scroll position
        scroller.addEventListener('scroll', () => {
            const center = scroller.scrollLeft + scroller.clientWidth / 2;
            let closest = 0;
            let best = Infinity;
            slides.forEach((s, i) => {
                const c = s.offsetLeft + s.clientWidth / 2;
                const d = Math.abs(c - center);
                if (d < best) { best = d; closest = i; }
            });
            if (closest !== activeIdx) { activeIdx = closest; update(); }
        }, { passive: true });

        // Wheel: vertical wheel moves cards horizontally while the
        // carousel can still move. At either edge the page keeps
        // scrolling vertically, so vertical scroll is never trapped.
        scroller.addEventListener('wheel', (e) => {
            // Native horizontal gestures (trackpad pan, shift+wheel)
            if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

            const goingNext = e.deltaY > 0;
            const canMove = goingNext ? activeIdx < total - 1 : activeIdx > 0;
            if (!canMove) return; // at an edge → let the page scroll normally

            e.preventDefault();
            scroller.scrollLeft += e.deltaY * 0.6;
        }, { passive: false });

        // Initialize — center first slide
        const first = slides[0];
        scroller.scrollTo({ left: first.offsetLeft - (scroller.clientWidth - first.clientWidth) / 2 });
        update();
    }

});
