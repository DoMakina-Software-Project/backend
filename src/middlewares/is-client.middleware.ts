import { Request, Response, NextFunction } from "express";
import type { UserWithRoles } from "../services/user.service";

interface AuthenticatedRequest extends Request {
	user?: UserWithRoles;
}

const isClient = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	const isAuthenticated = req.isAuthenticated();

	if (!isAuthenticated) {
		res.status(401).json({ message: "Unauthenticated" });
		return;
	}

	const user = req.user;

	if (!user) {
		res.status(401).json({ message: "Unauthenticated" });
		return;
	}

	if (user.roles.includes("CLIENT")) {
		next();
		return;
	}

	res.status(403).json({ message: "Unauthorized" });
};

export default isClient;
