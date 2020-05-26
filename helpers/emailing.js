const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = require("../config/keys").SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = async (username, email, verificationToken) => {
	try {
		const msg = {
			to: email,
			from: "verification@flight-sim-logbook.com",
			subject: "Flight Sim Logbook Email Verification",
			text: `Please click the link, or paste the link into your browser, to verify your email.\n\n`,
			html: `Please click the button, or paste the link into your browser, to verify your email.<br/><br/><a href = "">Verify!</a>`
		};
		await sgMail.send(msg);
	} catch(error) {
		console.error(error);
	}	
}

module.exports = { sendVerificationEmail }