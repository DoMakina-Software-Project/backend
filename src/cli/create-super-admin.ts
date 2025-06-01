import { Command } from "commander";
import sequelize from "../config/db";
import { UserRoleModel, UserModel } from "../models";
import { AuthService } from "../services";

interface UserWithRoles extends UserModel {
	UserRoles: UserRoleModel[];
}

const action = async (): Promise<void> => {
	try {
		console.log("Starting typesense migration process");
		await sequelize.authenticate();
		console.log(
			"Connection to the database has been established successfully!"
		);

		const email = "admin@domakina.tech";
		const password = AuthService.generateRandomPassword();

		console.log(`Admin email: ${email}`);
		console.log(`Admin password: ${password}`);

		const { hash, salt } = AuthService.saltAndHashPassword(password);

		const existingUser = (await UserModel.findOne({
			where: {
				email,
			},
			include: [
				{
					model: UserRoleModel,
					where: {
						role: "SUPERADMIN",
					},
				},
			],
		})) as UserWithRoles | null;

		if (existingUser) {
			const isSuperAdmin = existingUser.UserRoles.length > 0;

			if (!isSuperAdmin) {
				await UserRoleModel.create({
					userId: existingUser.id,
					role: "SUPERADMIN",
				});
			}

			await existingUser.update({
				email,
				password: hash,
				salt,
			});
		} else {
			const user = await UserModel.create({
				email,
				password: hash,
				salt,
				name: "Admin",
				surname: "Admin",
				status: "ACTIVE",
			});

			await UserRoleModel.create({
				userId: user.id,
				role: "SUPERADMIN",
			});
		}

		console.log("Admin created successfully");

		await sequelize.close();

		console.log("Connection to the database has been closed!");

		process.exit(0);
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		process.exit(1);
	}
};

const program = new Command();

program
	.command("create-admin")
	.description("start admin creation process")
	.action(action);

program.parse(process.argv);
