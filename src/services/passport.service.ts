import { UserService, AuthService } from ".";
import type { UserWithRoles } from "./user.service";

type PassportUser = {
	id: number;
};

type PassportCallback = (error: any, user?: any, info?: any) => void;

const PassportService = {
	login: async (
		_req: any,
		email: string,
		password: string,
		cb: PassportCallback
	): Promise<void> => {
		try {
			const user = await UserService.getUserByEmail(email);
			if (!user) {
				return cb(null, false, {
					message: "Invalid email or password",
				});
			}

			if (
				!AuthService.comparePasswords(
					password,
					user.password,
					user.salt
				)
			) {
				return cb(null, false, {
					message: "Invalid email or password",
				});
			}

			cb(null, user);
		} catch (error) {
			cb(error);
		}
	},

	serializeUser: async (
		user: UserWithRoles,
		done: PassportCallback
	): Promise<void> => {
		done(null, {
			id: user.id,
		});
	},

	deserializeUser: async (
		user: PassportUser,
		done: PassportCallback
	): Promise<void> => {
		try {
			const { id } = user;

			const fetchedUser = await UserService.getUserById(id);
			if (!fetchedUser) throw new Error("User not found");

			done(null, { ...fetchedUser });
		} catch (error: any) {
			done(error.message, null);
		}
	},
};

export default PassportService;
