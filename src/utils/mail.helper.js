import nodemailer from "nodemailer";
import mailBody from "../constants/mailBody.js";

export let sendMail = async (email, subject, data,type) => {
  try {
    const htmlData = await mailBody(data, email,type);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true if port is 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Send mail
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.MAIL_SOURCE}>`,
      to: email,
      subject,
      html: htmlData,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("SMTP email error:", err);
    return { success: false, error: err.message };
  }
};
