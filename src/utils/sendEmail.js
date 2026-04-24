import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  return transporter;
}

export async function sendEmail({ to, subject, text }) {
  try {
    const from = process.env.EMAIL_USER;
    const smtp = getTransporter();

    if (!smtp) {
      console.error("Email skipped: Missing EMAIL_USER or EMAIL_PASS");
      return { success: false, skipped: true };
    }

    if (!to) {
      console.error("Email skipped: Missing destination email");
      return { success: false, skipped: true };
    }

    if (!subject || !text) {
      console.error("Email skipped: Missing subject or body");
      return { success: false, skipped: true };
    }

    await smtp.sendMail({
      from,
      to,
      subject,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}
