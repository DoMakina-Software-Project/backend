import { UserRoleModel } from "../models";
import { InferAttributes } from "sequelize";

type UserRole = InferAttributes<UserRoleModel>;

type Role = "CLIENT" | "SELLER" | "STAFF" | "SUPERADMIN";

type CreateUserRoleParams = {
	userId: number;
	role: Role;
};

type CreateUserRolesParams = {
	userId: number;
	roles?: Role[];
};

const UserRoleService = {
	createUserRole: async ({
		userId,
		role,
	}: CreateUserRoleParams): Promise<UserRole> => {
		try {
			const existingUserRole =
				await UserRoleService.getUserRoleByUserIdAndRole({
					userId,
					role,
				});
			if (existingUserRole) throw new Error("User role already exists");

			const userRole = await UserRoleModel.create({ userId, role });
			return userRole.toJSON();
		} catch (error) {
			console.log(`UserRoleService.createUserRole() error: ${error}`);
			throw error;
		}
	},

	createUserRoles: async ({
		userId,
		roles = [],
	}: CreateUserRolesParams): Promise<UserRole[]> => {
		try {
			const userRoles = await UserRoleModel.bulkCreate(
				roles.map((role) => ({ userId, role }))
			);
			return userRoles.map((userRole) => userRole.toJSON());
		} catch (error) {
			console.log(`UserRoleService.createUserRoles() error: ${error}`);
			throw error;
		}
	},

	getUserRoles: async (userId: number): Promise<UserRole[]> => {
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

	getUserRoleByUserIdAndRole: async ({
		userId,
		role,
	}: CreateUserRoleParams): Promise<UserRole | null> => {
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

	getCountOfUsersByRole: async (role: Role): Promise<number> => {
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

	deleteUserRole: async ({
		userId,
		role,
	}: CreateUserRoleParams): Promise<boolean> => {
		try {
			const userRole = await UserRoleModel.findOne({
				where: { userId, role },
			});

			if (!userRole) throw new Error("User role not found");

			const deleted = await UserRoleModel.destroy({
				where: { userId, role },
			});

			return deleted ? true : false;
		} catch (error) {
			console.log(`UserRoleService.deleteUserRole() error: ${error}`);
			throw error;
		}
	},
};

export default UserRoleService;
