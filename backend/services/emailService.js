const nodemailer = require("nodemailer");
const db = require("../config/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (incident) => {
  const [rows] = await db.execute(
    "SELECT email FROM users WHERE role='responder'"
  );

  const emails = rows.map(r => r.email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails.length ? emails.join(",") : process.env.EMAIL_USER,
    subject: "🚨 New Incident",
    text: `${incident.type} - ${incident.description}`,
  });
};

// ✅ FIXED EXPORT (ONLY THIS MATTERS)
module.exports = { sendAlertEmail };