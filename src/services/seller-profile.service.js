import { SellerProfileModel } from "../models/index.js";

export default {
	getSellerProfileByUserId: async (userId) => {
		try {
			const sellerProfile = await SellerProfileModel.findOne({
				where: {
					userId,
				},
			});

			return sellerProfile.toJSON();
		} catch (error) {
			console.log(`getSellerProfileByUserId() error: ${error}`);
			return null;
		}
	},
	createSellerProfile: async ({
		userId,
		isBusiness,
		businessName,
		businessAddress,
		description,
		country,
		city,
		contactPhone,
		contactEmail,
	}) => {
		try {
			const sellerProfile = await SellerProfileModel.create({
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

			return sellerProfile.toJSON();
		} catch (error) {
			console.log(`createSellerProfile() error: ${error}`);
			return null;
		}
	},
};
