import { Request, Response, NextFunction } from "express";
import type { UserWithRoles } from "../services/user.service";
import { SellerProfileService } from "../services";

interface AuthenticatedRequest extends Request {
	user?: UserWithRoles;
}

const isSeller = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
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

	if (!user.roles.includes("SELLER")) {
		res.status(403).json({ message: "Unauthorized" });
		return;
	}

	const sellerProfile = await SellerProfileService.getSellerProfileByUserId(
		user.id
	);

	if (!sellerProfile) {
		res.status(403).json({ message: "Incomplete profile" });
		return;
	}

	next();
};

export default isSeller;
