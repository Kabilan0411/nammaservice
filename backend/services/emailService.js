const https = require('https');
const { Notification } = require('../models');

/**
 * Helper to dispatch email via Brevo REST API (HTTPS / Port 443)
 */
const sendEmailViaBrevoAPI = (options) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(options);

    const reqOptions = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.SMTP_PASS, // Using SMTP_PASS as Brevo API Key
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    const req = https.request(reqOptions, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            resolve(responseBody);
          }
        } else {
          reject(new Error(`Brevo API responded with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Send an email using Brevo HTTP REST API (with console logging and in-app notification backup)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML rich body
 * @param {string} userId - Recipient user ID (to create fallback in-app notifications)
 */
const sendEmail = async ({ to, subject, text, html, userId }) => {
  console.log(`\n==================================================`);
  console.log(`📧 SENDING BREVO HTTPS API EMAIL TO: ${to}`);
  console.log(`📧 SUBJECT: ${subject}`);
  console.log(`📧 BODY: ${text}`);
  console.log(`==================================================\n`);

  // Create companion in-app notification
  try {
    if (userId) {
      await Notification.create({
        userId: userId,
        title: subject,
        message: text,
        type: 'system'
      });
    }
  } catch (error) {
    console.error('Failed to create companion notification:', error.message);
  }

  // Format OTP email exactly as requested by user
  let finalSubject = subject;
  let finalHtml = html;
  let finalBarcodeText = text;

  const isOtpEmail = subject.toLowerCase().includes('verification code') || subject.toLowerCase().includes('otp');

  if (isOtpEmail) {
    finalSubject = 'Your NammaService Verification Code';
    
    // Parse user's name and OTP from text or context
    let name = 'User';
    let otp = '000000';

    // Extract name from text "Hello <Name>,"
    const nameMatch = text.match(/Hello\s+([^,\n\r]+)/i);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim();
    }

    // Extract 6-digit OTP code from text
    const otpMatch = text.match(/\b\d{6}\b/);
    if (otpMatch) {
      otp = otpMatch[0];
    }

    finalBarcodeText = `Hello ${name},\nYour verification code is: ${otp}\nThis code expires in 10 minutes.`;
    finalHtml = `<p>Hello ${name},</p><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`;
  }

  // Send via Brevo HTTPS API
  try {
    const fromEmail = process.env.EMAIL_FROM;
    const apiKey = process.env.SMTP_PASS;

    if (!fromEmail) {
      throw new Error('EMAIL_FROM is not defined in environment variables');
    }
    if (!apiKey) {
      throw new Error('SMTP_PASS/Brevo API Key is not defined in environment variables');
    }

    const payload = {
      sender: {
        name: 'NammaService',
        email: fromEmail
      },
      to: [{
        email: to
      }],
      subject: finalSubject,
      textContent: finalBarcodeText,
      htmlContent: finalHtml || finalBarcodeText.replace(/\n/g, '<br>')
    };

    const response = await sendEmailViaBrevoAPI(payload);
    console.log("Brevo HTTPS API email sent successfully");
    return response;
  } catch (error) {
    console.error("Brevo HTTPS API email dispatch failed:", error.message || error);
    throw error;
  }
};

module.exports = { sendEmail };
