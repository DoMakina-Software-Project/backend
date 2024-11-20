import app from "./config/express.js";
import router from "./routes/index.js";
import { PORT } from "./config/vars.js";
// import { initDB } from "./config/db.js";

// initDB();

app.use("/api", router);

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
