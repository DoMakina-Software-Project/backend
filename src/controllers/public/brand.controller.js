import { BrandService } from "../../services/index.js";
export default {
	getAllBrands: async (req, res) => {
		try {
			const brands = await BrandService.getAllBrands();
			return res.status(200).json(brands);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
};
