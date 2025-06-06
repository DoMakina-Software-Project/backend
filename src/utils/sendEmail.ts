import nodemailer from "nodemailer";
import { MAIL } from "../config/vars";

interface SendEmailProps {
	to: string;
	subject: string;
	html: string;
	throwError?: boolean;
}

const transporter = nodemailer.createTransport({
	host: MAIL.host,
	port: MAIL.port,
	auth: {
		user: MAIL.user,
		pass: MAIL.pass,
	},
});

const sendEmail = async ({
	to,
	subject,
	html,
	throwError = false,
}: SendEmailProps) => {
	try {
		const response = await transporter.sendMail({
			from: MAIL.user,
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

// const test = async () => {
// 	const response = await sendEmail({
// 		to: "elisbushaj2@gmail.com",
// 		subject: "Test Email",
// 		html: "<p>This is a test email</p>",
// 	});
// };

// test();
