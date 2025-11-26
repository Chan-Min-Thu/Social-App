import nodemailer from "nodemailer";
import "dotenv/config";
import { EmailData } from "../types/general.type";
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async (emailData: EmailData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailData.email,
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
