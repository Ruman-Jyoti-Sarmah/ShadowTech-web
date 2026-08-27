import nodemailer from 'nodemailer';

// Build a Nodemailer transporter using the Gmail account + app password from .env
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL for Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
};

// Send a notification email for a new consultation/contact submission.
// Sends FROM the configured Gmail account TO the configured Gmail account.
export const sendContactEmail = async ({ name, email, subject, message, phone }) => {
  const adminEmail = process.env.EMAIL_USER;
  const appName = 'ShadowTech';

  const mailOptions = {
    from: `"${process.env.APP_NAME || 'ShadowTech Website'}" <${adminEmail}>`,
    to: adminEmail, // deliver the notification to the same admin inbox
    replyTo: email, // replying on the email goes back to the submitter
    subject: `New Consultation Request: ${subject || 'N/A'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed; border-bottom: 2px solid #eee; padding-bottom: 8px;">
          🚀 New ${process.env.APP_NAME || 'ShadowTech'} Consultation Request
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Name</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject</td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Sent automatically from your ${process.env.APP_NAME || 'ShadowTech'} website.
        </p>
      </div>
    `
  };

  const info = await getTransporter().sendMail(mailOptions);

  return info;
};