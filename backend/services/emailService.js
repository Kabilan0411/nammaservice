const nodemailer = require('nodemailer');
const { Notification } = require('../models');

/**
 * Send an email using Nodemailer with Brevo SMTP (with console logging and in-app notification backup)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML rich body
 * @param {string} userId - Recipient user ID (to create fallback in-app notifications)
 */
const sendEmail = async ({ to, subject, text, html, userId }) => {
  console.log(`\n==================================================`);
  console.log(`📧 SENDING BREVO SMTP EMAIL TO: ${to}`);
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

  // Send via Nodemailer using Brevo SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.verify();
    console.log("Brevo SMTP transporter verified successfully");

    const fromEmail = process.env.EMAIL_FROM ||'nammaservice.in@gmail.com'
    if (!fromEmail) {
      throw new Error('EMAIL_FROM is not defined in environment variables');
    }

    const mailOptions = {
      from: `NammaService <${fromEmail}>`,
      to,
      subject: finalSubject,
      text: finalBarcodeText,
      html: finalHtml || finalBarcodeText.replace(/\n/g, '<br>')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Brevo SMTP email sent successfully");
    return info;
  } catch (error) {
    console.error("Brevo SMTP email dispatch failed:", error.message || error);
    throw error;
  }
};

module.exports = { sendEmail };
