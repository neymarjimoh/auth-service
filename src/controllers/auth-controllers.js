const ErrorHelper = require("../helpers/errorHelper");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const { sendActivationMail, passwordResetMail } = require("../helpers/mailer");
const {
	hashPassword,
	generateToken,
	comparePassword,
} = require("../helpers/auth-helpers");
const { EMAIL_SECRET } = require("../config/");

exports.registerUser = async (req, res, next) => {
	const { fullname, email, username, password, department } = req.body;
	const app = req.app;

	try {
		const hashedPassword = hashPassword(password);

		const user = new User({
			fullname,
			email,
			username,
			password: hashedPassword,
			unique_id: app.unique_id,
			app_name: app.app_name,
			organisation_name: app.org_name,
			department,
		});

		await sendActivationMail(user, req);

		await user.save();

		return res.status(201).json({
			message: "Check your mail, a confirmation mail has been sent to you",
		});
	} catch (error) {
		console.log(`Error from user registration >>> ${error.message}`);
		next(error);
	}
};

exports.verifyUser = async (req, res, next) => {
	const { token, email } = req.query;
	try {
		const { userId } = jwt.verify(token, EMAIL_SECRET);

		const user = await User.findById(userId);

		if (!user) {
			const err = new ErrorHelper(401, "fail", "Invalid registration link!");
			return next(err, req, res, next);
		}

		if (user.verified) {
			return next(
				new ErrorHelper(
					409,
					"conflict",
					"Your account has already been activated"
				),
				req,
				res,
				next
			);
		}

		const foundUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ verified: true }
		);
		if (!foundUser) {
			return next(
				new ErrorHelper(
					404,
					"fail",
					`Account with the email: ${email} does not exist`
				),
				req,
				res,
				next
			);
		}

		return res.status(200).json({
			message:
				"Welcome on board, your account has been activated. Proceed to sign in",
		});
	} catch (error) {
		console.log(`Error from user verification >>> ${error.message}`);
		return next(error);
	}
};

exports.loginUser = async (req, res, next) => {
	const { email, username, password } = req.body;
	const { app_name, unique_id } = req.app;
	let err;
	try {
		let user;

		if (!email && unique_id == "email") {
			err = new ErrorHelper(
				422,
				"fail",
				"You are required to login with your email"
			);
			return next(err, req, res, next);
		}

		if (!username && unique_id == "username") {
			err = new ErrorHelper(
				422,
				"fail",
				"You are required to login with your username"
			);
			return next(err, req, res, next);
		}

		if (unique_id == "email") {
			user = await User.findOne({ email, app_name });
		}

		if (unique_id == "username") {
			user = await User.findOne({ username, app_name });
		}

		if (!user) {
			err = new ErrorHelper(
				404,
				"fail",
				"You have entered an incorrect email/username or Password "
			);
			return next(err, req, res, next);
		}

		if (!user.verified) {
			err = new ErrorHelper(401, "fail", "You have to verify your account");
			return next(err, req, res, next);
		}

		const passwordValid = comparePassword(password, user.password);
		if (!passwordValid) {
			err = new ErrorHelper(
				401,
				"fail",
				"You Entered an incorrect Email or Password"
			);
			return next(err, req, res, next);
		}

		if (user.status == "disabled") {
			err = new ErrorHelper(
				401,
				"fail",
				"This account has been disabled due to certain reasons. Contact the admins for more information."
			);
			return next(err, req, res, next);
		}
		await User.findByIdAndUpdate(user._id, {
			$set: { last_login: new Date().toDateString() },
		});
		const token = generateToken(
			{ userId: user._id, app_name: user.app_name },
			"1d"
		);
		return res.status(200).json({
			message: `You have successfully logged in on ${app_name}..`,
			token,
		});
	} catch (error) {
		console.log(`Error from user login >>> ${error.message}`);
		return next(error);
	}
};

//forgot password before login
exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	const { app_name } = req.app;
	let err;
	try {
		if (!email) {
			err = new ErrorHelper(422, "fail", "Email field cannot be empty");
			return next(err, req, res, next);
		}

		const user = await User.findOne({ email });

		if (!user || !user.verified) {
			err = new ErrorHelper(
				404,
				"fail",
				`Email is not registered or has not been verified on ${app_name}`
			);
			return next(err, req, res, next);
		}

		await passwordResetMail(user, req);

		return res.status(200).json({
			message: `A password reset link has been sent to your email. You would get it if you had entered a correct email.`,
		});
	} catch (error) {
		console.log(`Error from user forgot password >>> ${error.message}`);
		return next(error);
	}
};

exports.resetPassword = async (req, res, next) => {
	const { newPassword } = req.body;
	const { token } = req.query;
	const { app_name } = req.app;
	let err;

	try {
		const { userId } = jwt.verify(token, EMAIL_SECRET);

		if (!userId) {
			err = new ErrorHelper(403, "fail", "Invalid link");

			return next(err, req, res, next);
		}

		const hashedPassword = hashPassword(newPassword);

		const updatePassword = await User.findOneAndUpdate(
			{ _id: userId },
			{
				$set: {
					password: hashedPassword,
				},
			}
		);

		if (!updatePassword) {
			err = new ErrorHelper(404, "fail", "Invalid user");

			return next(err, req, res, next);
		}

		return res.status(200).json({
			message: `Your password has been updated on ${app_name}. Proceed to login`,
		});
	} catch (error) {
		console.log(`Error from user reset password >>> ${error.message}`);
		return next(error);
	}
};

exports.changePassword = async (req, res, next) => {
	const { password, _id } = req.user;
	const { oldPassword, newPassword, confirmPassword } = req.body;
	let err;
	try {
		const passwordValid = comparePassword(oldPassword, password);
		if (!passwordValid) {
			err = new ErrorHelper(
				401,
				"fail",
				"You Entered an incorrect Email or Password"
			);
			return next(err, req, res, next);
		}
		const hashedPassword = hashPassword(newPassword);

		const updatePassword = await User.findOneAndUpdate(
			{ _id },
			{
				$set: {
					password: hashedPassword,
				},
			}
		);

		if (!updatePassword) {
			err = new ErrorHelper(404, "fail", "Invalid user");
			return next(err, req, res, next);
		}
		return res.status(200).json({
			message: "Your password updated successfully",
		});
	} catch (error) {
		console.log(red(`Error from user change password >>> ${error.message}`));
		return next(error);
	}
};

exports.tokenVerification = async (req, res, next) => {
	const user = req.user;
	const { app_name } = req.app;
	try {
		if (!user) {
			return res.status(401).json({
				message: "Missing credentials",
			});
		}
		//check if the decoded token contains a valid user -- verify the token
		const validUser = await User.findOne({ _id: user._id, app_name: app_name });

		if (!validUser) {
			return res.status(403).json({
				valid_token: false,
			});
		}
		return res.status(200).json({
			valid_token: true,
		});
	} catch (error) {
		console.log(red(`Error from token verification >>> ${error.message}`));
		return next(error);
	}
};
