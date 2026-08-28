import nodemailer from 'nodemailer';

const BRAND_COLOR = '#1a3c34';
const STORE_NAME = "AB's Supermarket";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });

  return transporter;
};

const wrapTemplate = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background:#f7f7f5;">
    <div style="background:${BRAND_COLOR}; padding: 24px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:22px; letter-spacing:1px;">${STORE_NAME}</h1>
    </div>
    <div style="background:#fff; padding: 28px; color:#222;">
      <h2 style="margin-top:0; color:${BRAND_COLOR};">${title}</h2>
      ${bodyHtml}
    </div>
    <div style="padding: 16px; text-align:center; color:#888; font-size:12px;">
      &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
    </div>
  </div>
`;

const sendMail = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
      console.warn('[emailService] SMTP credentials not configured - skipping email send.');
      return { success: false, reason: 'not_configured' };
    }
    const info = await getTransporter().sendMail({
      from: `"${STORE_NAME}" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[emailService] Failed to send email to ${to}:`, error.message);
    return { success: false, reason: error.message };
  }
};

const itemsToRows = (items = []) =>
  items
    .map(
      (i) => `
      <tr>
        <td style="padding:6px 0;">${i.name}</td>
        <td style="padding:6px 0; text-align:center;">${i.qty}</td>
        <td style="padding:6px 0; text-align:right;">$${Number(i.price).toFixed(2)}</td>
      </tr>`
    )
    .join('');

export const sendOrderConfirmation = async (order) => {
  const body = `
    <p>Hi ${order.customerInfo.name},</p>
    <p>Thank you for your order! Here's a summary:</p>
    <p><strong>Order #:</strong> ${order.orderNumber}</p>
    <table style="width:100%; border-collapse:collapse; margin:12px 0;">
      <thead>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:6px 0;"><strong>Item</strong></td>
          <td style="padding:6px 0; text-align:center;"><strong>Qty</strong></td>
          <td style="padding:6px 0; text-align:right;"><strong>Price</strong></td>
        </tr>
      </thead>
      <tbody>${itemsToRows(order.items)}</tbody>
    </table>
    <p style="text-align:right;"><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
    <p>We'll notify you when your order status changes. Thank you for shopping with ${STORE_NAME}!</p>
  `;
  return sendMail({
    to: order.customerInfo.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: wrapTemplate('Order Confirmed', body),
  });
};

export const sendOrderStatusUpdate = async (order) => {
  const body = `
    <p>Hi ${order.customerInfo.name},</p>
    <p>Your order <strong>${order.orderNumber}</strong> status has been updated to:</p>
    <p style="font-size:18px; color:${BRAND_COLOR};"><strong>${order.orderStatus}</strong></p>
    <p>Thank you for shopping with ${STORE_NAME}!</p>
  `;
  return sendMail({
    to: order.customerInfo.email,
    subject: `Order Update - ${order.orderNumber}`,
    html: wrapTemplate('Order Status Updated', body),
  });
};

export const sendAdminOrderNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
  const body = `
    <p>A new order has been placed.</p>
    <p><strong>Order #:</strong> ${order.orderNumber}</p>
    <p><strong>Customer:</strong> ${order.customerInfo.name} (${order.customerInfo.email}, ${order.customerInfo.phone})</p>
    <table style="width:100%; border-collapse:collapse; margin:12px 0;">
      <tbody>${itemsToRows(order.items)}</tbody>
    </table>
    <p style="text-align:right;"><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
  `;
  return sendMail({
    to: adminEmail,
    subject: `New Order Received - ${order.orderNumber}`,
    html: wrapTemplate('New Order Notification', body),
  });
};

export const sendContactFormEmail = async (submission) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
  const body = `
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone || 'N/A'}</p>
    <p><strong>Subject:</strong> ${submission.subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${submission.message}</p>
  `;
  return sendMail({
    to: adminEmail,
    subject: `New Contact Form Submission${submission.subject ? ': ' + submission.subject : ''}`,
    html: wrapTemplate('New Contact Submission', body),
  });
};

export const sendBirthdayAlert = async (users) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
  const rows = users
    .map((u) => `<tr><td style="padding:6px 0;">${u.name}</td><td style="padding:6px 0;">${u.email}</td><td style="padding:6px 0;">${u.phone || 'N/A'}</td></tr>`)
    .join('');
  const body = `
    <p>The following customer(s) have a birthday today:</p>
    <table style="width:100%; border-collapse:collapse; margin:12px 0;">
      <thead>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:6px 0;"><strong>Name</strong></td>
          <td style="padding:6px 0;"><strong>Email</strong></td>
          <td style="padding:6px 0;"><strong>Phone</strong></td>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p>Consider sending them a birthday discount coupon from Admin &gt; Coupons.</p>
  `;
  return sendMail({
    to: adminEmail,
    subject: `Customer Birthday${users.length > 1 ? 's' : ''} Today`,
    html: wrapTemplate('Birthday Reminder', body),
  });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  const body = `
    <p>Hi ${user.name},</p>
    <p>You requested a password reset. Click the button below to set a new password. This link expires in 10 minutes.</p>
    <p style="text-align:center; margin: 24px 0;">
      <a href="${resetUrl}" style="background:${BRAND_COLOR}; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px; display:inline-block;">Reset Password</a>
    </p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    html: wrapTemplate('Reset Your Password', body),
  });
};

export default {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAdminOrderNotification,
  sendContactFormEmail,
  sendPasswordResetEmail,
  sendBirthdayAlert,
};
