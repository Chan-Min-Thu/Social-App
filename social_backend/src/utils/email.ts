import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "0c6aa13a9bc61b",
    pass: "5c97563c1b510e",
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async (emailData: any) => {
  const mailOptions = {
    from: "chanminthu961549167@gmail.com",
    to: emailData.email,
    subject: emailData.subject,
    text: emailData.message, // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  };
  await transporter.sendMail(mailOptions);
};
