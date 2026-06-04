// Google Cloud Function for form processing
// Deploy to Cloud Functions with HTTP trigger

const nodemailer = require('nodemailer');

// Configuration - Set these as environment variables in Cloud Function
const TO_EMAIL = process.env.TO_EMAIL || 'your-email@example.com';
const GMAIL_USER = process.env.GMAIL_USER; // Your Gmail address
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // App-specific password
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'https://yourdomain.com';

// Create transporter (reuse across invocations)
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });
  }
  return transporter;
};

/**
 * HTTP Cloud Function for handling form submissions
 */
exports.handleFormSubmission = async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const formData = req.body;

    // Basic validation
    if (!formData.name || !formData.email || !formData.company) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    // Build email content
    const emailBody = `
New Assessment Request from Blackridge Website

Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}
Role: ${formData.role || 'Not specified'}
Current AI Usage: ${formData.usage || 'Not specified'}
Monthly AI Spend: ${formData.spend || 'Not specified'}
Primary Concern: ${formData.concern || 'Not specified'}
Multiple Providers: ${formData.providers || 'Not specified'}

Additional Notes:
${formData.notes || 'None provided'}

---
Submitted: ${new Date().toISOString()}
User Agent: ${req.get('user-agent') || 'Unknown'}
`;

    const mailOptions = {
      from: `"Blackridge Assessment Form" <${GMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: formData.email,
      subject: `New Assessment Request from ${formData.name} (${formData.company})`,
      text: emailBody
    };

    // Send email
    const transport = getTransporter();
    await transport.sendMail(mailOptions);

    // Optional: Store in Firestore
    // const { Firestore } = require('@google-cloud/firestore');
    // const firestore = new Firestore();
    // await firestore.collection('submissions').add({
    //   timestamp: new Date().toISOString(),
    //   ...formData
    // });

    res.status(200).json({
      success: true,
      message: 'Assessment request received. We will contact you within 2 business days.'
    });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({
      error: 'Failed to process request. Please try again or email us directly.'
    });
  }
};
