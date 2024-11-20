import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { FRONTEND_URL } from "./vars.js";

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

export default app;
