import { UserService, AuthService } from "./index.js";

export default {
	login: async (_req, email, password, cb) => {
		try {
			const user = await UserService.getUserByEmail(email);
			if (!user)
				return cb(null, false, {
					message: "Invalid email or password",
				});

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

	serializeUser: async (user, done) => {
		done(null, {
			id: user.id,
		});
	},

	deserializeUser: async (user, done) => {
		try {
			const { id } = user;

			const fetchedUser = await UserService.getUserById(id);
			if (!fetchedUser) throw new Error("User not found");

			done(null, { ...fetchedUser });
		} catch (error) {
			done(error.message, null);
		}
	},
};
