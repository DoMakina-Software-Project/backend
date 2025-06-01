import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { FRONTEND_URL, COOKIES_SECRET } from "./vars";
import session from "express-session";
import passport, { sessionStore } from "./passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: [FRONTEND_URL],
		credentials: true,
	})
);

app.use(helmet());
app.use(morgan("dev"));

app.use(
	session({
		secret: COOKIES_SECRET,
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Days
			httpOnly: true,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

export default app;
