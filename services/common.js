const nodemailer = require("nodemailer");

// Create a transporter with your email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "riazkhanafridi96@gmail.com",
    pass: "bmyw zeew nbsn ecvp",
  },
});

// Function to send an email
exports.sendMail = async function ({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: "riazkhanafridi96@gmail.com",
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    throw new Error("Failed to send email: " + error.message);
  }
};

// Function to generate an invoice template
exports.invoiceTemplate = function (order) {
  return `
    <div>
      <h2>Invoice</h2>
      <p>Address: ${order.selectedAddress.name}, ${order.selectedAddress.street}, ${order.selectedAddress.city}, ${order.selectedAddress.state}, ${order.selectedAddress.pinCode}</p>
      <p>Phone: ${order.selectedAddress.phone}</p>
    </div>
  `;
};
