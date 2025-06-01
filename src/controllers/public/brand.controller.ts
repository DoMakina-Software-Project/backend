import { Request, Response } from "express";
import { BrandService } from "../../services";

const BrandController = {
	getAllBrands: async (req: Request, res: Response): Promise<void> => {
		try {
			const brands = await BrandService.getAllBrands();
			res.status(200).json(brands);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};

export default BrandController;
