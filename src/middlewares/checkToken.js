const {} = require("../helpers/auth-helpers");
const ErrorHelper = require("../helpers/errorHelper");
const axios = require("axios");
const routes = require("../constants/routesGroup");

//middleware that authenticates any application using auth-service -- gatepass <-- auth-service communication
const checkAuth = async (req, res, next) => {
	if (routes.secureRoutes.includes(req.path)) {
		try {
			if (!req.headers.authorization) {
				return res.status(412).json({
					message: "Access denied!! Missing authorization credentials",
				});
			}

			let token = req.headers.authorization;

			if (token.startsWith("Bearer ")) {
				token = token.split(" ")[1];
			}

			const options = {
				headers: {
					"Content-Type": "application/json",
					"app-token": `Bearer ${token}`,
				},
			};
			const response = await axios.get(
				"http://localhost:5000/api/v1/apps/auth",
				options
			);
			req.app = response.data.app;
			return next();
		} catch (error) {
			console.log(
				"Error from application authentication >>>>> ",
				error.message
			);
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

//middleware that authenticates the requests coming from gatepass -- gatepass --> auth-service communication
const gatepassAuth = async (req, res, next) => {
	if (
		routes.gatepassRoutes.includes(req.path) ||
		!routes.secureRoutes.includes(req.path)
	) {
		try {
			if (!req.headers["gatepass-token"]) {
				console.log(req.path);
				return res.status(412).json({
					message: "Access denied!! Missing authorization credentials",
				});
			}

			let token = req.headers["gatepass-token"];

			if (token.startsWith("Bearer ")) {
				token = token.split(" ")[1];
			}

			const options = {
				headers: {
					"Content-Type": "application/json",
					"auth-service-token": `Bearer ${token}`,
				},
			};

			const response = await axios.get(
				"http://localhost:5000/api/v1/services/auth",
				options
			);
			req.org = response.data.organisation;
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
	gatepassAuth,
};
