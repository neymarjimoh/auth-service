module.exports = {
	secureRoutes: [
		"/api/v1/auth/register",
		"/api/v1/auth/verify",
		"/api/v1/auth/login",
		"/api/v1/auth/forgot-password",
		"/api/v1/auth/password-reset",
	],
	gatepassRoutes: [
		"/api/v1/:orgname/:appname/users",
		"/api/v1/1/:appname/users",
	],
};
