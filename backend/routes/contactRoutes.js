// const express = require('express');
// const nodemailer = require('nodemailer');
// const router = express.Router();

// // 1. Nodemailer Transporter Setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//     },
// });

// // 2. POST Route for Contact Form Submission: /api/contact
// router.post('/contact', async (req, res) => {
//     // Note: phone_number matches the corrected HTML input name
//     const { name, email, project_type, phone_number, message } = req.body;

//     if (!name || !email || !message) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Error: Name, Email, and Message are required fields.' 
//         });
//     }

//     // 3. Email Content
//     const mailOptions = {
//         from: process.env.EMAIL_USER, 
//         to: process.env.EMAIL_USER,   
//         subject: `ShadowTech Lead: New Project Inquiry from ${name}`,
//         html: `
//             <h3>New Contact Request:</h3>
//             <ul>
//                 <li><strong>Name:</strong> ${name}</li>
//                 <li><strong>Email:</strong> ${email}</li>
//                 <li><strong>Phone:</strong> ${phone_number || 'N/A'}</li>
//                 <li><strong>Project Type:</strong> ${project_type || 'N/A'}</li>
//             </ul>
//             <h4>Message:</h4>
//             <p>${message}</p>
//         `,
//     };

//     // 4. Send the Email
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent successfully from ${name} (${email})`);

//         return res.status(200).json({ 
//             success: true, 
//             message: `Thank you, ${name}! Your consultation request is logged. We'll be in touch soon.` 
//         });

//     } catch (error) {
//         console.error('Nodemailer Error:', error);
        
//         return res.status(500).json({ 
//             success: false, 
//             message: 'Server Error: Message could not be sent. Please check server logs and your .env credentials.' 
//         });
//     }
// });

// module.exports = router;



// const express = require('C:/Users/ruman/AppData/Local/Microsoft/TypeScript/5.9/node_modules/@types/express/index');
// const nodemailer = require('C:/Users/ruman/AppData/Local/Microsoft/TypeScript/5.9/node_modules/@types/nodemailer/index');
// const contactRoutes = require('d:/User(D)/Coding/Shadow Tech/backend//models/Contact.js'); // Import the Mongoose model
// app.use('/api', contactRoutes);
// const router = express.Router('contact');

// // 1. Nodemailer Transporter Setup (Same as before)
// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//     },
// });

// // 2. POST Route for Contact Form Submission: /api/contact
// router.post('/contact', async (req, res) => {
//     const { name, email, project_type, phone_number, message } = req.body;

//     if (!name || !email || !message) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Error: Name, Email, and Message are required fields.' 
//         });
//     }

//     try {
//         // A. SAVE DATA TO MONGODB (Database integration)
//         const newContact = new Contact({
//             name, 
//             email, 
//             project_type, 
//             phone_number, 
//             message 
//         });
//         await newContact.save();
//         console.log(`Database Success: New contact saved for ${name}`);


//         // B. SEND EMAIL (Nodemailer integration)
//         const mailOptions = {
//             from: process.env.EMAIL_USER, 
//             to: process.env.EMAIL_USER,   
//             subject: `ShadowTech Lead: New Project Inquiry from ${name}`,
//             html: `
//                 <h3>New Contact Request (Saved to DB):</h3>
//                 <ul>
//                     <li><strong>ID:</strong> ${newContact._id}</li>
//                     <li><strong>Name:</strong> ${name}</li>
//                     <li><strong>Email:</strong> ${email}</li>
//                     <li><strong>Phone:</strong> ${phone_number || 'N/A'}</li>
//                     <li><strong>Project Type:</strong> ${project_type || 'N/A'}</li>
//                 </ul>
//                 <h4>Message:</h4>
//                 <p>${message}</p>
//             `,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`Email Success: Email sent to ${process.env.EMAIL_USER}`);

//         // Success response to the frontend
//         return res.status(200).json({ 
//             success: true, 
//             message: `Thank you, ${name}! Your consultation request is logged and saved. We'll be in touch soon.` 
//         });

//     } catch (error) {
//         console.error('Final Submission Error:', error);
        
//         // Handle Mongoose validation errors
//         let errorMessage = 'Server Error: Message could not be processed.';
//         if (error.name === 'ValidationError') {
//             errorMessage = `Validation failed: ${Object.values(error.errors).map(e => e.message).join(', ')}`;
//         }
        
//         return res.status(500).json({ 
//             success: false, 
//             message: errorMessage
//         });
//     }
// });

// module.exports = router;




// const express = require('express');
// const nodemailer = require('nodemailer');
// const Contact = require('../models/Contact');
// const router = express.Router();

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // POST /api/contact
import express from 'express';
import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newContact = await Contact.create({ name, email, subject, message });

        const mailOptions = {
            from: `ShadowTech Contact Form <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `[NEW ShadowTech DB Entry] ${subject}`,
            html: `
                <p><strong>Database ID:</strong> ${newContact._id}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="border-left: 3px solid #00e0ff; padding-left: 10px;">${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Message received, saved to database, and email sent successfully!', data: newContact });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ error: 'Internal Server Error: Could not process message.' });
    }
});

export default router;