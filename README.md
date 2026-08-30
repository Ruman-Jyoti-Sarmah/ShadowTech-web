# ShadowTechX — Static Website (GitHub Pages)

Fully static frontend website. No backend, no server, no build step.

## Architecture

```
GitHub Pages (static hosting)
        ↓
index1.html  ·  style1.css  ·  script1.js  ·  thank-you-popup.css/js
        ↓
Launch Consultation (contact form)
        ↓
EmailJS (browser SDK, loaded from CDN)
        ↓
Business email inbox
```

The consultation form sends enquiries **directly from the browser** through the
official EmailJS SDK. No `backend/` folder, Node.js, Express, API routes, or
serverless functions are used or required — the site works even if no backend
exists in the repository.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing / intro screen |
| `index1.html` | Main website (services, pricing, FAQ, contact form) |
| `index2.html` | Projects page |
| `style.css` / `style1.css` / `style2.css` | Page styles |
| `script.js` / `script1.js` / `script2.js` | Page behavior (form + EmailJS in `script1.js`) |
| `thank-you-popup.js` / `thank-you-popup.css` | Premium 3D "Thank You" popup (shown only on EmailJS success) |
| `3d-bg.js` | Three.js animated background |
| `scroll-reveal.js` | 3D scroll-reveal animations |
| `images/` | Static images |

## EmailJS Setup (required before the form works)

All three values are **frontend-safe** (they are public by design — EmailJS
secures the actual email account on its servers). Never put a Gmail/SMTP
password or any private credential in this repository.

1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. **Email Services** → add your email service → copy the **Service ID**.
3. **Email Templates** → create a template:
   - **Subject:** `New ShadowTechX Project Enquiry`
   - **Body:**
     ```
     New ShadowTechX Project Enquiry

     Full Name:
     {{full_name}}

     Professional Email:
     {{email}}

     Website / Mobile App:
     {{project_name}}

     Phone:
     {{phone}}

     Project Details:
     {{project_details}}
     ```
4. **Account → API Keys** → copy the **Public Key**.
5. Open `script1.js` and replace the placeholders in `EMAILJS_CONFIG`:

   ```js
   const EMAILJS_CONFIG = {
       serviceId:  'YOUR_EMAILJS_SERVICE_ID',
       templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
       publicKey:  'YOUR_EMAILJS_PUBLIC_KEY'
   };
   ```

Template variables must match the keys sent in `script1.js`:
`full_name`, `email`, `project_name`, `phone`, `project_details`.

## Deployment (GitHub Pages)

Deployment is automated via `.github/workflows/static.yml` — every push to
`main` publishes the repository root to GitHub Pages. No configuration or
build step is needed.

## Security Notes

- Only EmailJS **Service ID / Template ID / Public Key** are used in the frontend.
- No SMTP, Gmail, or API credentials are stored in any frontend file.
- Environment files (`.env`) are git-ignored and must never be committed.

---

© 2025 ShadowTech — Authors: Ruman Jyoti Sarmah & Amlan Phukon

