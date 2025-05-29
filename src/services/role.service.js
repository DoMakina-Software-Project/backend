import { RoleModel } from "../models/index.js";

export default {
	getRole: async (roleName) => {
		try {
			const role = await RoleModel.findByPk(roleName);
			return role ? role.toJSON() : null;
		} catch (error) {
			console.log(`RoleService.getRole() error: ${error}`);
			throw error;
		}
	},
};
