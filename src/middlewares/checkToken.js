const {} = require("../helpers/auth-helpers");
const ErrorHelper = require("../helpers/errorHelper");
const axios = require("axios");
const routes = require("../constants/routesGroup");

const checkAuth = async (req, res, next) => {
	if (routes.secureRoutes.includes(req.path)) {
		if (!req.headers.authorization) {
			return res.status(412).json({
				message: "Access denied!! Missing authorization credentials",
			});
		}

		let token = req.headers.authorization;

		if (token.startsWith("Bearer ")) {
			token = token.split(" ")[1];
		}

		try {
			const options = {
				headers: {
					"Content-Type": "application/json",
					"app-token": `Bearer ${token}`,
				},
			};
			const response = await axios.get(
				"http://localhost:5000/api/v1/apps/appone",
				options
			);
			req.app = response.data.app;
			return next();
		} catch (error) {
			console.log("Error from user authentication >>>>> ", error.message);
			if (error.name === "TokenExpiredError") {
				const err = new ErrorHelper(401, "fail", "Token has expired");
				next(err);
			}
			return next(error);
		}
	} else {
		return next();
	}
};

module.exports = {
	checkAuth,
};
