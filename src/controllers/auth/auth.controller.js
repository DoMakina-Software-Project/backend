import {
	UserService,
	AuthService,
	UserRoleService,
} from "../../services/index.js";
import passport from "../../config/passport.js";

export default {
	login: (req, res, next) => {
		passport.authenticate("local", (err, user) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}

			if (!user) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			req.login(user, (err) => {
				if (err) {
					return res.status(400).json({ message: err.message });
				}

				return res.status(200).json({ message: "User logged in" });
			});
		})(req, res, next);
	},

	register: async (req, res, next) => {
		try {
			const { name, surname, email, password } = req.body;

			const existingUser = await UserService.getUserByEmail(email);
			if (existingUser)
				return res.status(400).json({ message: "User already exists" });

			const { hash, salt } = AuthService.saltAndHashPassword(password);

			const user = await UserService.createUser({
				name,
				surname,
				email,
				password: hash,
				salt,
				isActive: false,
			});

			if (!user)
				return res
					.status(400)
					.json({ message: "User could not be created" });

			const userRole = await UserRoleService.createUserRole({
				userId: user.id,
				role: "user",
			});

			if (!userRole) {
				return res
					.status(400)
					.json({ message: "User role could not be created" });
			}

			if (!user.isActive) {
				// Send email verification token
			}

			passport.authenticate("local", (err, user) => {
				if (err) {
					return res.status(400).json({ message: err.message });
				}
				if (!user) {
					return res
						.status(401)
						.json({ message: "Authentication failed" });
				}
				req.login(user, async (err) => {
					if (err) {
						return res.status(400).json({ message: err.message });
					}

					res.status(200).json({
						message: "Registration and login successful",
					});
				});
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	},

	logout: async (req, res) => {
		req.logout((error) => {
			if (error) {
				return res.status(400).json({ message: error.message });
			}

			return res.status(200).json({ message: "User logged out" });
		});
	},

	getUser: async (req, res) => {
		const user = req.user;
		if (!user) return res.status(401).json({ message: "User not found" });

		return res.status(200).json(user);
	},
};
