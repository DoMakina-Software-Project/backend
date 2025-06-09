import { Request, Response } from "express";
import { BrandService } from "../../services";

const BrandController = {
	getAllBrands: async (req: Request, res: Response): Promise<void> => {
		try {
			const { page } = req.query;
			const pageNumber = page ? Number(page) : 1;
			const brands = await BrandService.getAllBrands(pageNumber);
			res.status(200).json(brands);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	getAllBrandsSimple: async (req: Request, res: Response): Promise<void> => {
		try {
			const brands = await BrandService.getAllBrandsSimple();
			res.status(200).json(brands);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};

export default BrandController;
