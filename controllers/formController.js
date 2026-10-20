const transporter = require("../config/mailer");
const { renderHome } = require("./homeController");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form values are inserted into the email HTML, so they must be escaped.
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const send = async (req, res, next) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const description = (req.body.description || "").trim();

  if (!name || !EMAIL_PATTERN.test(email) || !description) {
    return renderHome(req, res, { message: "Please fill in all the fields" }, 400).catch(next);
  }

  const mailOptions = {
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: "Node Contact Request",
    text: `Name: ${name}\nEmail: ${email}\nDescription: ${description}`,
    html: `
      <ul>
        <li>Name: ${escapeHtml(name)}</li>
        <li>Email: ${escapeHtml(email)}</li>
        <li>Description: ${escapeHtml(description)}</li>
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
    return renderHome(req, res, { message: "Error sending email" }, 500).catch(next);
  }
  return renderHome(req, res, { message: "Email sent successfully" }).catch(next);
};

module.exports = { send };
