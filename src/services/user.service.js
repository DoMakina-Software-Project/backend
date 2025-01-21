import { RoleModel, UserModel } from "../models/index.js";

export default {
	getUserById: async (id) => {
		try {
			const user = await UserModel.findByPk(id, {
				include: [
					{
						model: RoleModel,
					},
				],
			});

			if (!user) return null;

			const userJson = user.toJSON();

			return user ? user.toJSON() : null;
		} catch (error) {
			console.log(`UserService.getUserById() error: ${error}`);
		}
	},

	getUserByEmail: async (email) => {
		try {
			const user = await UserModel.findOne({ where: { email } });
			return user ? user.toJSON() : null;
		} catch (error) {
			console.log(`UserService.getUserByEmail() error: ${error}`);
		}
	},
};
