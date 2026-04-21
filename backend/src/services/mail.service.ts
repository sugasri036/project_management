import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const isDefaultConfig = process.env.SMTP_USER === "your-email@gmail.com" || !process.env.SMTP_USER;

  if (isDefaultConfig) {
    console.log("=================================================");
    console.log("⚠️  SMTP is not configured. Email check skipped.");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Email content (HTML omitted for brevity)");
    console.log("=================================================");
    return { messageId: "mock-id" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "Aura"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER
        }>`, // sender address
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
