// app/api/sendSellMail/route.js

import nodemailer from 'nodemailer';

export async function POST(request) {
  const body = await request.json();
  const { email, subject, html } = body;

  const isValidEmail = (email) =>
    typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(email) || !subject || !html) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Shameer Cars" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
