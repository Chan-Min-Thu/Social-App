import nodemailer from "nodemailer";
import "dotenv/config";

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async (emailData: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "zinmyohtwe398@gmail.com",
    subject: emailData.subject,
    text: emailData.message, // plain‑text body
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred. " + error.message);
      return process.exit(1);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
