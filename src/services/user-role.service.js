import { UserRoleModel } from "../models/index.js";

const UserRoleService = {
	createUserRole: async ({ userId, role }) => {
		try {
			const existingUserRole =
				await UserRoleService.getUserRoleByUserIdAndRole({
					userId,
					role,
				});
			if (existingUserRole) throw new Error("User role already exists");

			const userRole = await UserRoleModel.create({ userId, role });
			return userRole;
		} catch (error) {
			console.log(`UserRoleService.createUserRole() error: ${error}`);
			throw error;
		}
	},

	createUserRoles: async ({ userId, roles = [] }) => {
		try {
			const userRoles = await UserRoleModel.bulkCreate(
				roles.map((role) => ({ userId, role }))
			);
			return userRoles;
		} catch (error) {
			console.log(`UserRoleService.createUserRoles() error: ${error}`);
			throw error;
		}
	},

	getUserRoles: async (userId) => {
		try {
			const userRoles = await UserRoleModel.findAll({
				where: { userId },
			});
			return userRoles.map((userRole) => userRole.toJSON());
		} catch (error) {
			console.log(`UserRoleService.getUserRoles() error: ${error}`);
			throw error;
		}
	},

	getUserRoleByUserIdAndRole: async ({ userId, role }) => {
		try {
			const userRole = await UserRoleModel.findOne({
				where: { userId, role },
			});
			return userRole ? userRole.toJSON() : null;
		} catch (error) {
			console.log(
				`UserRoleService.getUserRoleByUserIdAndRole() error: ${error}`
			);
			throw error;
		}
	},

	getCountOfUsersByRole: async (role) => {
		try {
			const count = await UserRoleModel.count({ where: { role } });
			return count;
		} catch (error) {
			console.log(
				`UserRoleService.getCountOfUsersByRole() error: ${error}`
			);
			throw error;
		}
	},
};

export default UserRoleService;
