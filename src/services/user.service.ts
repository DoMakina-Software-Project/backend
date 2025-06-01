import { UserRoleModel, UserModel } from "../models";
import { InferAttributes, InferCreationAttributes } from "sequelize";

export type User = InferAttributes<UserModel>;

type UserIncludingRoles = User & {
	UserRoles?: InferAttributes<UserRoleModel>[];
};

export type UserWithRoles = UserIncludingRoles & {
	roles: string[];
};

type UserCreation = Omit<User, "id" | "createdAt" | "updatedAt">;

export default {
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
};
