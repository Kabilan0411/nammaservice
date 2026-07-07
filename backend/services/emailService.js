const nodemailer = require('nodemailer');
const { Notification } = require('../models');

// Configure NodeMailer transporter using Gmail SMTP
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  const secure = port === 465; // true only for port 465

  console.log(`🔐 Nodemailer Transporter Initialized - Host: ${host}, Port: ${port}, User: ${process.env.EMAIL_USER}`);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Avoids SSL/TLS verification issues on some local setups
    }
  });
};

/**
 * Send an email using Nodemailer SMTP (with console logging and in-app notification backup)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML rich body
 * @param {string} userId - Recipient user ID (to create fallback in-app notifications)
 */
const sendEmail = async ({ to, subject, text, html, userId }) => {
  console.log(`\n==================================================`);
  console.log(`📧 SENDING EMAIL TO: ${to}`);
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

  // Attempt real email send
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.EMAIL_USER || 'nammaservice.in@gmail.com';
    const info = await transporter.sendMail({
      from: `"NammaService" <${fromEmail}>`,
      to,
      subject: finalSubject,
      text: finalBarcodeText,
      html: finalHtml || finalBarcodeText.replace(/\n/g, '<br>')
    });
    
    console.log(`📧 Email successfully sent to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.warn(`📧 SMTP email dispatch failed: ${error.message || error}`);
    throw error; // Return the exact error if email sending fails
  }
};

module.exports = { sendEmail };
