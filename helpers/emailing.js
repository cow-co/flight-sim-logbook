const mailer = require("nodemailer");
const EMAIL_PW = require("../config/keys").EMAIL_PW;
const EMAIL_UN = require("../config/keys").EMAIL_UN;
let transport = null;

// Don't want to send emails in a dev environment
if (process.env.NODE_ENV === "production") {
  console.log("Creating transport");
  transport = mailer.createTransport({
    service: "hotmail",
    auth: {
      user: EMAIL_UN,
      pass: EMAIL_PW,
    },
  });
  if (!transport) {
    console.log("Transport creation failed");
  }
}

const sendVerificationEmail = (username, email, url) => {
  const msg = {
    to: email,
    from: "noreply@flight-sim-logbook.herokuapp.com",
    subject: "Flight Sim Logbook Email Verification",
    text: `Hello ${username}!\n\nPlease click the link, or paste the link into your browser, to verify your email.\n\n${url}`,
    html: `Hello ${username}!<br/><br/>Please click the link, or paste the link into your browser, to verify your email.<br/><br/><a href = "${url}">Verify!</a>`,
  };
  // Don't want to send emails in a dev environment
  if (process.env.NODE_ENV === "production") {
    transport.sendMail(msg, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

const sendResetEmail = (username, email, url) => {
  const msg = {
    to: email,
    from: "noreply@flight-sim-logbook.herokuapp.com",
    subject: "Flight Sim Logbook Password Reset",
    text: `Hello ${username}!\n\nPlease click the link, or paste the link into your browser, to reset your password.\n\n${url}`,
    html: `Hello ${username}!<br/><br/>Please click the link, or paste the link into your browser, to reset your password.<br/><br/><a href = "${url}">Reset Password!</a>`,
  };
  // Don't want to send emails in a dev environment
  if (process.env.NODE_ENV === "production") {
    transport.sendMail(msg, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

module.exports = { sendVerificationEmail, sendResetEmail };
