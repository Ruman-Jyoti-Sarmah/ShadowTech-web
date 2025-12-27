// models/Contact.js - cleaned
// const mongoose = require('mongoose');

// // Define the schema for a new contact form submission (a "Lead")
// const contactSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         match: [/.+@.+\..+/, 'Must use a valid email address'] // Basic email validation
//     },
//     project_type: {
//         type: String,
//         default: 'Not Specified'
//     },
//     phone_number: {
//         type: String,
//         default: 'N/A'
//     },
//     message: {
//         type: String,
//         required: [true, 'Message is required']
//     },
//     // Timestamp for when the entry was created
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Export the model, which will create a collection named 'contacts' in MongoDB
// module.exports = mongoose.model('Contact', contactSchema);



// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: [true, 'Name is required'] },
//   email: { type: String, required: [true, 'Email is required'], match: [/.+@.+\..+/, 'Must use a valid email'] },
//   project_type: { type: String, default: 'Not Specified' },
//   phone_number: { type: String, default: 'N/A' },
//   message: { type: String, required: [true, 'Message is required'] },
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Contact', contactSchema);



// --- models/Contact.js ---
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;