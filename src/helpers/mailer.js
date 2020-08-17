const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD, EMAIL_SECRET } = require("../config/");
const hbs = require("nodemailer-express-handlebars");
const jwt = require("jsonwebtoken");

const config = () => {
	return nodemailer.createTransport({
		service: "Gmail",
		port: 465,
		auth: {
			user: EMAIL_ADDRESS,
			pass: EMAIL_PASSWORD,
		},
	});
};

const hbsOptions = {
	viewEngine: {
		extName: ".hbs",
		defaultLayout: "",
	},
	viewPath: "./src/views/",
	extName: ".hbs",
};

const transport = config();
transport.use("compile", hbs(hbsOptions));

const sendActivationMail = async (data, req) => {
	const userEmail = data.email;
	const userName = data.fullname;
	const verificationToken = jwt.sign({ userId: data._id }, EMAIL_SECRET, {
		expiresIn: "1d",
	});

	const generateLink = `http:\/\/${req.headers.host}\/api\/v1\/auth\/verify?email=${userEmail}&token=${verificationToken}`;

	const msg = {
		from: EMAIL_ADDRESS,
		to: userEmail,
		subject: "Confirm email",
		text: "testing text",
		template: "confirmEmail",
		context: {
			name: userName,
			activationLink: generateLink,
		},
	};

	let info = await transport.sendMail(msg);
	console.log(`mail sent succcessfully >>> ${info.messageId}`);
	return;
};

module.exports = {
	sendActivationMail,
};
