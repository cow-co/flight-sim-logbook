const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (username, email, url) => {
  const msg = {
    to: email,
    from: "verification@flight-sim-logbook.herokuapp.com",
    subject: "Flight Sim Logbook Email Verification",
    text: `Hello ${username}!\n\nPlease click the link, or paste the link into your browser, to verify your email.\n\n${url}`,
    html: `Hello ${username}!<br/><br/>Please click the link, or paste the link into your browser, to verify your email.<br/><br/><a href = "${url}">Verify!</a>`,
  };
  // Don't want to send emails in a dev environment
  if (process.env.NODE_ENV === "production") {
    await sgMail.send(msg);
  }
};

const sendResetEmail = async (username, email, url) => {
  const msg = {
    to: email,
    from: "reset@flight-sim-logbook.herokuapp.com",
    subject: "Flight Sim Logbook Password Reset",
    text: `Hello ${username}!\n\nPlease click the link, or paste the link into your browser, to reset your password.\n\n${url}`,
    html: `Hello ${username}!<br/><br/>Please click the link, or paste the link into your browser, to reset your password.<br/><br/><a href = "${url}">Reset Password!</a>`,
  };
  // Don't want to send emails in a dev environment
  if (process.env.NODE_ENV === "production") {
    await sgMail.send(msg);
  }
};

module.exports = { sendVerificationEmail, sendResetEmail };
