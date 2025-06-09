import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import type { UserWithRoles } from "../services/user.service";

const checkUserStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Skip if user is not authenticated
		if (!req.isAuthenticated() || !req.user) {
			return next();
		}

		const user = req.user as UserWithRoles;

		// Check current user status from database
		const currentUser = await UserService.getUserById(user.id);

		if (!currentUser) {
			// User not found in database, logout
			req.logout(() => {
				res.status(401).json({
					message: "User not found. Please login again.",
					shouldLogout: true,
				});
			});
			return;
		}

		// Check if user status has changed
		if (currentUser.status !== "ACTIVE") {
			let message = "Your account is not active.";

			switch (currentUser.status) {
				case "BANNED":
					message =
						"Your account has been banned. Please contact support.";
					break;
				case "INACTIVE":
					message =
						"Your account is inactive. Please contact support.";
					break;
				case "DELETED":
					message = "Your account has been deleted.";
					break;
			}

			// Force logout for non-active users
			req.logout(() => {
				res.status(403).json({
					message,
					shouldLogout: true,
					status: currentUser.status,
				});
			});
			return;
		}

		// Update the user object in session if roles have changed
		if (
			JSON.stringify(user.roles.sort()) !==
			JSON.stringify(currentUser.roles.sort())
		) {
			req.user = currentUser;
		}

		next();
	} catch (error) {
		console.error("checkUserStatus middleware error:", error);
		next(); // Continue with request even if status check fails
	}
};

export default checkUserStatus;
