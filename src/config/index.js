require("dotenv").config();
module.exports = {
	DB_URI: process.env.DB_URI || "mongodb://127.0.0.1:27017/authService",
	PORT: process.env.PORT || "5001",
	HOST: process.env.HOST || "localhost",
};
