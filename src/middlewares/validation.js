const { body, validationResult } = require("express-validator");
const { User } = require("../models/");

const signUpValidationRules = () => {
	return [
		body("email").isEmail().withMessage("Enter a valid email"),
		body("fullname").notEmpty().withMessage("Enter your full name"),
		body("username")
			.optional()
			.isLength({ min: 5 })
			.withMessage("Username must have at least 5 characters"),
		body("password")
			.notEmpty()
			.isLength({ min: 6 })
			.withMessage("Password must contain at least 6 characters"),
		body("email").custom((val, { req }) => {
			return User.findOne({ email: val, app_name: req.app.app_name }).then(
				(user) => {
					if (user) {
						return Promise.reject(
							"Email has already been registered on the application"
						);
					}
				}
			);
		}),
		body("username")
			.optional()
			.custom((val, { req }) => {
				return User.findOne({ username: val, app_name: req.app.app_name }).then(
					(user) => {
						if (user) {
							return Promise.reject(
								"Username has already been taken on the application"
							);
						}
					}
				);
			}),
	];
};

const signInValidationRules = () => {
	return [
		body("email").isEmail().withMessage("Enter a valid email"),
		body("password")
			.notEmpty()
			.isLength({ min: 6 })
			.withMessage("Password must contain at least 6 characters"),
	];
};

const PasswordResetValidationRules = () => {
	return [
		body("newPassword")
			.isLength({
				min: 6,
			})
			.withMessage("Password must contain at least 6 characters"),
	];
};

const validateError = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(422).json({
		errors: extractedErrors,
	});
};

module.exports = {
	signUpValidationRules,
	signInValidationRules,
	PasswordResetValidationRules,
	validateError,
};
