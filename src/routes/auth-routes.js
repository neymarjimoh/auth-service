const router = require("express").Router();

const { registerUser, verifyUser } = require("../controllers/auth-controllers");

const {
	signUpValidationRules,
	validateError,
} = require("../middlewares/validation");

router.post("/register", signUpValidationRules(), validateError, registerUser);

router.patch("/verify", verifyUser);

module.exports = router;
