import { config } from "dotenv";
config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 4000;

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const DB = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "3306", 10),
	username: process.env.DB_USER || "your_db_user",
	password: process.env.DB_PASSWORD || "your_db_password",
	database: process.env.DB_DATABASE || "your_db_name",
};
