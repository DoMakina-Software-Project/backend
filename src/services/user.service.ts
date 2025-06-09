import { AuthService, UserRoleService } from ".";
import { UserRoleModel, UserModel } from "../models";
import { InferAttributes, Op } from "sequelize";

export type User = InferAttributes<UserModel>;

type UserIncludingRoles = User & {
	UserRoles?: InferAttributes<UserRoleModel>[];
};

export type UserWithRoles = UserIncludingRoles & {
	roles: string[];
};

type UserCreation = Omit<User, "id" | "createdAt" | "updatedAt">;

type UserCreationWithPassword = UserCreation & {
	password: string;
};

type StaffCreationParams = Pick<User, "email" | "name" | "surname">;

type StaffCreationResponse = {
	status: "OK" | "GENERAL_ERROR";
	message: string;
	user?: UserCreationWithPassword;
};

const UserService = {
	getUserById: async (id: number): Promise<UserWithRoles | null> => {
		try {
			const user = await UserModel.findByPk(id, {
				include: [
					{
						model: UserRoleModel,
					},
				],
			});

			if (!user) return null;

			const userJson = user.toJSON() as UserIncludingRoles;

			const { UserRoles, ...rest } = userJson;

			let roles: string[] = [];

			if (UserRoles) {
				roles = UserRoles.map((userRole) => userRole.role);
			}

			return { ...rest, roles };
		} catch (error) {
			console.log(`UserService.getUserById() error: ${error}`);
			throw error;
		}
	},

	getUserByEmail: async (email: string): Promise<User | null> => {
		try {
			const user = await UserModel.findOne({ where: { email } });

			return user ? user.toJSON() : null;
		} catch (error) {
			console.log(`UserService.getUserByEmail() error: ${error}`);
			throw error;
		}
	},

	createUser: async (data: UserCreation): Promise<User | null> => {
		try {
			const user = await UserModel.create(data);

			return user ? user.toJSON() : null;
		} catch (error) {
			console.log(`UserService.createUser() error: ${error}`);
			throw error;
		}
	},

	updateUserById: async (
		id: number,
		data: Partial<Omit<User, "id">>
	): Promise<boolean> => {
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

	getAllUsers: async (
		page: number = 1,
		role?: string
	): Promise<{
		results: UserWithRoles[];
		totalItems: number;
		hasNextPage: boolean;
		totalPages: number;
	}> => {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const includeOptions: any = {
				model: UserRoleModel,
				where: {
					role: {
						[Op.ne]: "SUPERADMIN",
					},
				},
			};

			if (role && role !== "SUPERADMIN") {
				includeOptions.where = { role };
			}

			const { count, rows: users } = await UserModel.findAndCountAll({
				include: [includeOptions],
				limit,
				offset,
				order: [["createdAt", "DESC"]],
			});

			const results = users.map((user) => {
				const userJson = user.toJSON() as UserIncludingRoles;
				const { UserRoles, ...rest } = userJson;
				const roles = UserRoles ? UserRoles.map((ur) => ur.role) : [];
				return { ...rest, roles };
			});

			return {
				results,
				totalItems: count,
				hasNextPage: limit * page < count,
				totalPages: Math.ceil(count / limit),
			};
		} catch (error) {
			console.log(`UserService.getAllUsers() error: ${error}`);
			throw error;
		}
	},

	getUsersByRole: async (
		role: string,
		page: number = 1
	): Promise<{
		results: UserWithRoles[];
		totalItems: number;
		hasNextPage: boolean;
		totalPages: number;
	}> => {
		try {
			if (role === "SUPERADMIN") {
				return {
					results: [],
					totalItems: 0,
					hasNextPage: false,
					totalPages: 0,
				};
			}

			const limit = 10;
			const offset = (page - 1) * limit;

			const { count, rows: users } = await UserModel.findAndCountAll({
				include: [
					{
						model: UserRoleModel,
						where: { role },
					},
				],
				limit,
				offset,
				order: [["createdAt", "DESC"]],
			});

			const results = users.map((user) => {
				const userJson = user.toJSON() as UserIncludingRoles;
				const { UserRoles, ...rest } = userJson;
				const roles = UserRoles ? UserRoles.map((ur) => ur.role) : [];
				return { ...rest, roles };
			});

			return {
				results,
				totalItems: count,
				hasNextPage: limit * page < count,
				totalPages: Math.ceil(count / limit),
			};
		} catch (error) {
			console.log(`UserService.getUsersByRole() error: ${error}`);
			throw error;
		}
	},

	updateUserStatus: async (
		id: number,
		status: "ACTIVE" | "INACTIVE" | "BANNED" | "DELETED"
	): Promise<boolean> => {
		try {
			const [rowsCount] = await UserModel.update(
				{ status },
				{ where: { id } }
			);

			return rowsCount > 0;
		} catch (error) {
			console.log(`UserService.updateUserStatus() error: ${error}`);
			throw error;
		}
	},

	banUser: async (id: number): Promise<boolean> => {
		try {
			return await UserService.updateUserStatus(id, "BANNED");
		} catch (error) {
			console.log(`UserService.banUser() error: ${error}`);
			throw error;
		}
	},

	unbanUser: async (id: number): Promise<boolean> => {
		try {
			return await UserService.updateUserStatus(id, "ACTIVE");
		} catch (error) {
			console.log(`UserService.unbanUser() error: ${error}`);
			throw error;
		}
	},

	getUserStatistics: async (): Promise<{
		total: number;
		active: number;
		inactive: number;
		banned: number;
		deleted: number;
		byRole: { [key: string]: number };
	}> => {
		try {
			const [totalUsers, statusCounts, roleCounts] = await Promise.all([
				// Count users excluding superadmins
				UserModel.count({
					include: [
						{
							model: UserRoleModel,
							where: {
								role: {
									[Op.ne]: "SUPERADMIN",
								},
							},
						},
					],
				}),
				// Count users by status excluding superadmins
				UserModel.findAll({
					attributes: [
						"status",
						[
							UserModel.sequelize?.fn(
								"COUNT",
								UserModel.sequelize?.col("User.id")
							),
							"count",
						],
					],
					include: [
						{
							model: UserRoleModel,
							where: {
								role: {
									[Op.ne]: "SUPERADMIN",
								},
							},
							attributes: [],
						},
					],
					group: ["status"],
					raw: true,
				}),
				UserRoleModel.findAll({
					attributes: [
						"role",
						[
							UserRoleModel.sequelize?.fn(
								"COUNT",
								UserRoleModel.sequelize?.col("user_id")
							),
							"count",
						],
					],
					where: {
						role: {
							[Op.ne]: "SUPERADMIN",
						},
					},
					group: ["role"],
					raw: true,
				}),
			]);

			const statusMap: any = {
				active: 0,
				inactive: 0,
				banned: 0,
				deleted: 0,
			};

			statusCounts.forEach((item: any) => {
				statusMap[item.status.toLowerCase()] = parseInt(item.count);
			});

			const byRole: { [key: string]: number } = {};
			roleCounts.forEach((item: any) => {
				byRole[item.role] = parseInt(item.count);
			});

			return {
				total: totalUsers,
				...statusMap,
				byRole,
			};
		} catch (error) {
			console.log(`UserService.getUserStatistics() error: ${error}`);
			throw error;
		}
	},

	getAllStaff: async (
		page: number = 1
	): Promise<{
		results: UserWithRoles[];
		totalItems: number;
		hasNextPage: boolean;
		totalPages: number;
	}> => {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const { count, rows: users } = await UserModel.findAndCountAll({
				include: [
					{
						model: UserRoleModel,
						where: {
							role: "STAFF",
						},
					},
				],
				limit,
				offset,
				order: [["createdAt", "DESC"]],
			});

			const results = users.map((user) => {
				const userJson = user.toJSON() as UserIncludingRoles;
				const { UserRoles, ...rest } = userJson;
				const roles = UserRoles ? UserRoles.map((ur) => ur.role) : [];
				return { ...rest, roles };
			});

			return {
				results,
				totalItems: count,
				hasNextPage: limit * page < count,
				totalPages: Math.ceil(count / limit),
			};
		} catch (error) {
			console.log(`UserService.getAllStaff() error: ${error}`);
			throw error;
		}
	},

	createStaff: async ({
		email,
		name,
		surname,
	}: StaffCreationParams): Promise<StaffCreationResponse> => {
		try {
			const existingUser = await UserService.getUserByEmail(email);
			if (existingUser) {
				const existingUserRole =
					await UserRoleService.getUserRoleByUserIdAndRole({
						userId: existingUser.id,
						role: "STAFF",
					});

				if (existingUserRole) {
					return {
						status: "GENERAL_ERROR",
						message: "User already exists",
					};
				}

				await UserRoleService.createUserRole({
					userId: existingUser.id,
					role: "STAFF",
				});

				return {
					status: "OK",
					message: "User role created successfully",
				};
			}

			const randomPassword = AuthService.generateRandomPassword();
			const { salt, hash } =
				AuthService.saltAndHashPassword(randomPassword);

			const user = await UserService.createUser({
				email,
				name,
				surname,
				password: hash,
				salt,
				status: "ACTIVE",
			});

			if (!user) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to create user",
				};
			}

			await UserRoleService.createUserRole({
				userId: user.id,
				role: "STAFF",
			});

			return {
				status: "OK",
				message: "User created successfully",
				user: { ...user, password: randomPassword },
			};
		} catch (error) {
			console.log(`UserService.createStaff() error: ${error}`);
			throw error;
		}
	},
};

export default UserService;
