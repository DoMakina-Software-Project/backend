import { Sequelize, Options } from "sequelize";
import { DB } from "./vars";

const dbConfig: Options = {
	dialect: "mysql",
	...DB,
	logging: false,
};

console.log(dbConfig);

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
