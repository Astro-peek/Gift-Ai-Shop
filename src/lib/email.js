import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSplitPaymentEmail({ to, initiatorName, amount, paymentLink, orderSummary }) {
  const mailOptions = {
    from: `"GiftAI Luxury" <${process.env.SMTP_USER}>`,
    to,
    subject: `${initiatorName} invited you to split a gift order payment`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Split Payment Invitation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A0804; margin: 0; padding: 0; color: #F0EAD6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #13110C; border: 1px solid #2E2A1E; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1A1710 0%, #13110C 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #2E2A1E; }
          .logo { font-family: Georgia, serif; font-size: 32px; color: #C9A84C; font-weight: 700; letter-spacing: 2px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; margin-bottom: 20px; color: #F0EAD6; }
          .message { font-size: 15px; line-height: 1.7; color: #a89878; margin-bottom: 30px; }
          .amount-box { background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px; }
          .amount-label { font-size: 12px; color: #C9A84C; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700; }
          .amount { font-size: 36px; font-weight: 700; color: #C9A84C; font-family: Georgia, serif; }
          .cta-button { display: inline-block; background: #C9A84C; color: #0A0804; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; margin: 20px 0; transition: all 0.3s ease; }
          .cta-button:hover { background: #d4b55d; transform: translateY(-2px); }
          .divider { height: 1px; background: #2E2A1E; margin: 30px 0; }
          .order-summary { background: rgba(255,255,255,0.02); border-radius: 10px; padding: 20px; margin-top: 20px; }
          .summary-title { font-size: 13px; color: #6B6248; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 700; }
          .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #a89878; }
          .footer { background: #0f0d08; padding: 25px 30px; text-align: center; border-top: 1px solid #2E2A1E; }
          .footer-text { font-size: 12px; color: #6B6248; }
          .link-text { color: #6B6248; font-size: 12px; word-break: break-all; margin-top: 10px; }
          @media (max-width: 480px) {
            .content, .header, .footer { padding: 25px 20px; }
            .amount { font-size: 28px; }
            .cta-button { padding: 14px 30px; font-size: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✦ GiftAI</div>
          </div>
          <div class="content">
            <div class="greeting">Hello,</div>
            <div class="message">
              <strong style="color: #C9A84C;">${initiatorName}</strong> has invited you to contribute to a special gift order. 
              Your contribution will help make this gift possible. Please complete your payment using the secure link below.
            </div>
            
            <div class="amount-box">
              <div class="amount-label">Your Contribution</div>
              <div class="amount">₹${amount.toLocaleString()}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${paymentLink}" class="cta-button">Pay Securely →</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="order-summary">
              <div class="summary-title">Order Summary</div>
              ${orderSummary.map(item => `
                <div class="summary-item">
                  <span>${item.name} × ${item.qty}</span>
                  <span>₹${(item.price * item.qty).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: rgba(201, 168, 76, 0.05); border-radius: 8px; border-left: 3px solid #C9A84C;">
              <p style="margin: 0; font-size: 13px; color: #a89878; font-style: italic;">
                "The greatest gift is the joy of giving together. Thank you for being part of this special moment."
              </p>
            </div>
          </div>
          <div class="footer">
            <div class="footer-text">
              Secure payment powered by Razorpay<br>
              GiftAI Luxury Gifting Platform
            </div>
            <div class="link-text">${paymentLink}</div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}

export async function sendPaymentConfirmationEmail({ to, initiatorName, amount, paidBy }) {
  const mailOptions = {
    from: `"GiftAI Luxury" <${process.env.SMTP_USER}>`,
    to,
    subject: `Payment received from ${paidBy}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background-color: #0A0804; margin: 0; padding: 20px; color: #F0EAD6; }
          .container { max-width: 500px; margin: 0 auto; background-color: #13110C; border: 1px solid #2E2A1E; border-radius: 12px; padding: 30px; }
          .success { color: #52b788; font-size: 48px; text-align: center; margin-bottom: 20px; }
          .title { font-size: 22px; color: #C9A84C; text-align: center; margin-bottom: 20px; font-family: Georgia, serif; }
          .message { font-size: 15px; line-height: 1.6; color: #a89878; text-align: center; }
          .amount { font-size: 28px; color: #C9A84C; font-weight: 700; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✓</div>
          <div class="title">Payment Received!</div>
          <div class="amount">₹${amount.toLocaleString()}</div>
          <div class="message">
            <strong>${paidBy}</strong> has successfully contributed to your gift order.<br><br>
            You'll receive another notification once all participants have completed their payments and the order is confirmed.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}
