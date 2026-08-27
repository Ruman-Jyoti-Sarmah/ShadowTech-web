document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api/contact'
        : 'https://shadow-tech-backend.onrender.com/api/contact';

    const form = document.getElementById('contact-form');
    const messageElement = document.getElementById('form-message');

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });

    // Close sidebar when clicking a link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
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
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Collect form data from the known IDs
        const formData = {
            name: form.querySelector('#full-name').value.trim(),
            email: form.querySelector('#professional-email').value.trim(),
            subject: form.querySelector('#website-name').value.trim() || 'New Consultation Request',
            message: form.querySelector('#project-details').value.trim(),
            phone: form.querySelector('#phone-number') ? form.querySelector('#phone-number').value.trim() : ''
        };

        // Basic client validation
        if (!formData.name || !formData.email || !formData.message) {
            showMessage('Please fill in required fields: Name, Email, Message.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Launch Consultation';
            return;
        }

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                showMessage(result.message || 'Thank you! Your request was submitted.', 'success');
                form.reset();
            } else {
                showMessage(result.error || result.message || 'Server error while submitting the form.', 'error');
            }
        } catch (err) {
            console.error('Network error:', err);
            showMessage('Connection Error: Could not reach the server. Is the Node.js backend running?', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Launch Consultation';
            setTimeout(() => messageElement.classList.add('form-message-hidden'), 7000);
        }
    });
});
