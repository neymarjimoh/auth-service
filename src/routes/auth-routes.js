const router = require("express").Router();

const { 
	registerUser, 
	verifyUser,
	loginUser,
} = require("../controllers/auth-controllers");

const {
	signUpValidationRules,
	signInValidationRules,
	validateError,
} = require("../middlewares/validation");

router.post("/register", signUpValidationRules(), validateError, registerUser);

router.patch("/verify", verifyUser);

router.post("/login", signInValidationRules(), validateError, loginUser);

module.exports = router;
