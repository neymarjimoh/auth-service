const router = require("express").Router();

const {
	registerUser,
	verifyUser,
	loginUser,
	forgotPassword,
	resetPassword,
	changePassword,
} = require("../controllers/auth-controllers");

const {
	signUpValidationRules,
	signInValidationRules,
	PasswordResetValidationRules,
	changePasswordValRules,
	validateError,
} = require("../middlewares/validation");

router.post("/register", signUpValidationRules(), validateError, registerUser);

router.patch("/verify", verifyUser);

router.post("/login", signInValidationRules(), validateError, loginUser);

router.post("/forgot-password", forgotPassword);
router.patch(
	"/password-reset",
	PasswordResetValidationRules(),
	validateError,
	resetPassword
);
router.post(
	"/change-password",
	changePasswordValRules(),
	validateError,
	changePassword
);

module.exports = router;
