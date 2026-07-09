const { Resend } = require('resend');
const { Notification } = require('../models');

/**
 * Send an email using Resend API (with console logging and in-app notification backup)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML rich body
 * @param {string} userId - Recipient user ID (to create fallback in-app notifications)
 */
const sendEmail = async ({ to, subject, text, html, userId }) => {
  console.log(`\n==================================================`);
  console.log(`📧 SENDING RESEND EMAIL TO: ${to}`);
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

  // Send via Resend SDK
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.EMAIL_FROM || 'nammaservice.in@gmail.com';

    const response = await resend.emails.send({
      from: `NammaService <${fromEmail}>`,
      to: [to],
      subject: finalSubject,
      text: finalBarcodeText,
      html: finalHtml || finalBarcodeText.replace(/\n/g, '<br>')
    });

    if (response.error) {
      throw new Error(response.error.message || JSON.stringify(response.error));
    }

    console.log(`📧 Resend email successfully dispatched. ID: ${response.data?.id}`);
    return response.data;
  } catch (error) {
    console.error(`📧 Resend email dispatch failed: ${error.message || error}`);
    throw error; // Return the exact error if email sending fails
  }
};

module.exports = { sendEmail };
