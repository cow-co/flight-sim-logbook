const mailer = require("nodemailer");
const EMAIL_PW = require("../config/keys").EMAIL_PW;
const EMAIL_UN = require("../config/keys").EMAIL_UN;

const transport = mailer.createTransport({
	pool: true,
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: EMAIL_UN,
		pass: EMAIL_PW
	}
});

const sendVerificationEmail = async (username, email, url) => {
	const msg = {
		to: email,
		from: "verification@flight-sim-logbook.herokuapp.com",
		subject: "Flight Sim Logbook Email Verification",
		text: `Hello ${username}!\n\nPlease click the link, or paste the link into your browser, to verify your email.\n\n${url}`,
		html: `Hello ${username}!<br/><br/>Please click the link, or paste the link into your browser, to verify your email.<br/><br/><a href = "${url}">Verify!</a>`
	};
	transport.sendMail(msg, (err, info) => {
		if(err) {
			console.log(err);
		}
	});
}

module.exports = { sendVerificationEmail }