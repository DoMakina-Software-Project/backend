import { SellerProfileModel } from "../models";
import type { InferAttributes } from "sequelize";

type SellerProfile = InferAttributes<SellerProfileModel>;

type CreateSellerProfileParams = {
	userId: number;
	isBusiness: boolean;
	businessName?: string;
	businessAddress?: string;
	description?: string;
	country: string;
	city: string;
	contactPhone: string;
	contactEmail: string;
};

const SellerProfileService = {
	getSellerProfileByUserId: async (
		userId: number
	): Promise<SellerProfile | null> => {
		try {
			const sellerProfile = await SellerProfileModel.findOne({
				where: {
					userId,
				},
			});

			return sellerProfile ? sellerProfile.toJSON() : null;
		} catch (error) {
			console.log(
				`SellerProfileService.getSellerProfileByUserId() error: ${error}`
			);
			throw error;
		}
	},

	createSellerProfile: async (
		params: CreateSellerProfileParams
	): Promise<SellerProfile | null> => {
		try {
			const sellerProfile = await SellerProfileModel.create({
				userId: params.userId,
				isBusiness: params.isBusiness,
				businessName: params.businessName,
				businessAddress: params.businessAddress,
				description: params.description,
				country: params.country,
				city: params.city,
				contactPhone: params.contactPhone,
				contactEmail: params.contactEmail,
			});

			return sellerProfile ? sellerProfile.toJSON() : null;
		} catch (error) {
			console.log(
				`SellerProfileService.createSellerProfile() error: ${error}`
			);
			throw error;
		}
	},
};

export default SellerProfileService;
