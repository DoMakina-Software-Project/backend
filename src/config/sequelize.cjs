const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	host: process.env.DB_HOST || "127.0.0.1",
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	dialect: "mysql",
};
