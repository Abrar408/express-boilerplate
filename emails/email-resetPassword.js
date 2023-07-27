const transporter = require("../config/email.config");

const sendResetPasswordEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password",
    html: `<p>Please enter OTP to verify your email:</p>
    <h2>${otp}</h2>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending reset password email");
  }
};

module.exports = sendResetPasswordEmail;
