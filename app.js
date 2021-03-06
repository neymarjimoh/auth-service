require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dbConnect = require("./src/config/db");
const globalErrHandler = require("./src/controllers/errorController");
const ErrorHelper = require("./src/helpers/errorHelper");
const { checkAuth, gatepassAuth, requireLogin } = require("./src/middlewares/checkToken");

const { authRouter, requestRouter } = require("./src/routes/");

// const isProduction = process.env.NODE_ENV === "production";

dbConnect();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(checkAuth);
app.use(gatepassAuth);
app.use(requireLogin);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "welcome to auth-service",
	});
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/", requestRouter);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
// 	const error = new Error("Not found");
// 	error.status = 404;
// 	next(error);
// });

//handle Undefined routes
app.use("*", (req, res, next) => {
	const err = new ErrorHelper(404, "fail", "undefined route");
	next(err, req, res, next);
});

// error handler
// app.use((error, req, res, next) => {
// 	if (error.status === 404) {
// 		return res.status(404).json({
// 			errors: { message: "Invalid Request, Resource not found" },
// 		});
// 	}
// if (!isProduction) {
// 	return res.status(error.status || 500).json({
// 		errors: {
// 			message: error.message,
// 			error: error,
// 		},
// 	});
// }
// 	return res.status(error.status || 500).json({
// 		errors: {
// 			message: "Something went wrong, please try again or check back for a fix",
// 		},
// 	});
// });

app.use(globalErrHandler);

module.exports = app;
