import nodemailer from "nodemailer";
import { MAIL } from "../config/vars.js";

const transporter = nodemailer.createTransport({
	host: MAIL.host,
	port: MAIL.port,
	auth: {
		user: MAIL.user,
		pass: MAIL.pass,
	},
});

const sendEmail = async ({ to, subject, html, throwError = false }) => {
	try {
		const response = await transporter.sendMail({
			from: MAIL.from,
			to,
			subject,
			html,
		});
		console.log(`Email sent: ${response.messageId}`);
	} catch (err) {
		console.log(`Error sending email: ${err}`);
		if (throwError) throw err;
	}
};

export default sendEmail;
