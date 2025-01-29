import { UserRoleModel, UserModel } from "../models/index.js";

export default {
	getUserById: async (id) => {
		try {
			const user = await UserModel.findByPk(id, {
				include: [
					{
						model: UserRoleModel,
					},
				],
			});

			if (!user) return null;

			const userJson = user.toJSON();
			const { UserRoles, ...rest } = userJson;

			const roles = UserRoles?.map((userRole) => userRole?.role) || [];

			return { ...rest, roles };
		} catch (error) {
			console.log(`UserService.getUserById() error: ${error}`);
			throw error;
		}
	},

	getUserByEmail: async (email) => {
		try {
			const user = await UserModel.findOne({ where: { email } });
			return user ? user.toJSON() : null;
		} catch (error) {
			console.log(`UserService.getUserByEmail() error: ${error}`);
			throw error;
		}
	},

	createUser: async ({ email, name, surname, password, salt, isActive }) => {
		try {
			const user = await UserModel.create({
				email,
				name,
				surname,
				password,
				salt,
				isActive,
			});

			return user.toJSON();
		} catch (error) {
			console.log(`UserService.createUser() error: ${error}`);
			throw error;
		}
	},

	updateUserById: async (id, data) => {
		try {
			const [rowsCount] = await UserModel.update(data, {
				where: { id },
			});

			return rowsCount > 0;
		} catch (error) {
			console.log(`UserService.updateUserById() error: ${error}`);
			throw error;
		}
	},
};
