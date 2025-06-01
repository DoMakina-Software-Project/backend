import { Request, Response } from "express";
import { SellerProfileService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface SellerRequest extends Request {
	user: UserWithRoles;
}

const SellerProfileController = {
	async createSellerProfile(
		req: SellerRequest,
		res: Response
	): Promise<void> {
		try {
			const {
				isBusiness,
				businessName,
				businessAddress,
				description,
				country,
				city,
				contactPhone,
				contactEmail,
			} = req.body;

			const userId = req.user.id;

			const sellerProfile =
				await SellerProfileService.createSellerProfile({
					userId,
					isBusiness,
					businessName,
					businessAddress,
					description,
					country,
					city,
					contactPhone,
					contactEmail,
				});

			if (!sellerProfile) {
				res.status(400).json({
					message: "Failed to create seller profile",
				});
				return;
			}

			res.status(200).json({
				message: "Seller profile created successfully",
			});
		} catch (error: any) {
			console.log(`createSellerProfile() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};

export default SellerProfileController;
