export default {
	login: async (req, email, password, cb) => {
		try {
			cb(null, {});
		} catch (error) {
			cb(error);
		}
	},

	serializeUser: async (user, done) => {
		done(null, {
			id: user.id,
			roles: user.roles,
		});
	},

	deserializeUser: async (user, done) => {
		try {
			const { id, roles } = user;
			done(null, { id, roles });
		} catch (error) {
			done(error);
		}
	},
};
