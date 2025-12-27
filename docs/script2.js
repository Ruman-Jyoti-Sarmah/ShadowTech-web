document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/api/contact';

    const form = document.getElementById('contact-form');
    const messageElement = document.getElementById('form-message');

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
            phone_number: form.querySelector('#phone-number') ? form.querySelector('#phone-number').value.trim() : ''
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
            showMessage('Connection Error: Could not reach the server. Is the Laravel backend running on port 8000?', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Launch Consultation';
            setTimeout(() => messageElement.classList.add('form-message-hidden'), 7000);
        }
    });
});
