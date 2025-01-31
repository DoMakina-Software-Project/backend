import { config } from "dotenv";
config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 4000;

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const COOKIES_SECRET =
	process.env.COOKIES_SECRET || "your_cookies_secret";

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const DB = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "3306", 10),
	username: process.env.DB_USER || "your_db_user",
	password: process.env.DB_PASSWORD || "your_db_password",
	database: process.env.DB_DATABASE || "your_db_name",
};

export const MAIL = {
	host: process.env.MAIL_HOST || "live.smtp.mailtrap.io",
	port: parseInt(process.env.MAIL_PORT || "587", 10),
	user: process.env.MAIL_USER || "your_mail_user",
	pass: process.env.MAIL_PASSWORD || "your_mail_password",
	from: process.env.MAIL_FROM || "your_mail_from",
};

export const MINIO = {
	endPoint: process.env.MINIO_ENDPOINT || "localhost",
	port: parseInt(process.env.MINIO_PORT || "9000", 10),
	useSSL: process.env.MINIO_USE_SSL === "true",
	accessKey: process.env.MINIO_ACCESS_KEY || "access_key",
	secretKey: process.env.MINIO_SECRET_KEY || "secret_key",
};

export const MINIO_PUBLIC_URL = `${
	MINIO.useSSL ? "https" : "http"
}://localhost:${MINIO.port}`;
