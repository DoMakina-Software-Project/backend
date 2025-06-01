import app from "./config/express";
import router from "./routes";
import { PORT } from "./config/vars";
import { initDB } from "./config/db";

initDB();

app.use("/api", router);

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
