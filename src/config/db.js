import { Sequelize } from "sequelize";
import { DB } from "./vars.js";

const dbConfig = {
	dialect: "mysql",
	...DB,
	logging: false,
};

// Create the database connection
const sequelize = new Sequelize(dbConfig);

export const initDB = () => {
	sequelize
		.authenticate()
		.then(() => {
			console.log(
				"Connection to the database has been established successfully!"
			);
		})
		.catch((err) => {
			console.error("Unable to connect to the database:", err);
		});
};

export default sequelize;
