import { SellerProfileService } from "../../services/index.js";

export default {
	async createSellerProfile(req, res) {
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
				return res.status(400).json({
					message: "Failed to create seller profile",
				});
			}

			return res.status(200).json({
				message: "Seller profile created successfully",
			});
		} catch (error) {
			console.log(`createSellerProfile() error: ${error}`);
			return res.status(500).json({ message: error.message });
		}
	},
};
