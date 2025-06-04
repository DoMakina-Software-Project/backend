import { AuthService, UserRoleService } from ".";
import { UserRoleModel, UserModel } from "../models";
import { InferAttributes } from "sequelize";

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

	getAllStaff: async (): Promise<UserWithRoles[]> => {
		try {
			const users = await UserModel.findAll({
				include: [
					{
						model: UserRoleModel,
						where: {
							role: "STAFF",
						},
					},
				],
			});

			return users.map((user) => {
				const userJson = user.toJSON() as UserIncludingRoles;
				const { UserRoles, ...rest } = userJson;
				const roles = UserRoles ? UserRoles.map((ur) => ur.role) : [];
				return { ...rest, roles };
			});
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
