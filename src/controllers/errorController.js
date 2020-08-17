const isProduction = process.env.NODE_ENV === "production";
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (!isProduction) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: {
				message: err.message,
				statusCode: err.statusCode,
			},
		});
	}

	return res.status(err.statusCode).json({
		status: err.status,
		message:
			err.message ||
			"Something went wrong, please try again or check back for a fix",
	});
};
