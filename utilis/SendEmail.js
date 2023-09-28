const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: "solutionspro.09@gmail.com",
      to: email,
      subject: subject || "Verify your email",
      text: text,
    });
    
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
