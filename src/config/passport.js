import passport from "passport";
import SequelizeStore from "connect-session-sequelize";
import session from "express-session";
import sequelize from "./db.js";
import { Strategy as LocalStrategy } from "passport-local";
import { PassportService } from "../services/index.js";

const sequelizeStore = SequelizeStore(session.Store);

export const sessionStore = new sequelizeStore({
	db: sequelize,
	checkExpirationInterval: 900000, // Check for expired sessions every 15 minutes (900000 ms)
	expiration: 1000 * 60 * 60 * 24 * 14, // Expire the session after 14 days
});

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passReqToCallback: true,
		},
		PassportService.login
	)
);

passport.serializeUser(PassportService.serializeUser);
passport.deserializeUser(PassportService.deserializeUser);

export default passport;
