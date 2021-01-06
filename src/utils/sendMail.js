const nodemailer = require('nodemailer');

exports.sendMail = async function (options) {
	let defaultOptions = {
		email: 'test@test.com',
		subject: 'some default subject',
		bodyText: 'some random text',
		bodyHtml: '<b>some random text</b>',
	};

	options = { ...defaultOptions, ...options };

	let transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	let info = await transporter.sendMail({
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.bodyText,
		html: options.bodyHtml,
	});

	console.log('Message sent: %s', info.messageId);
	// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

// main().catch(console.error);
