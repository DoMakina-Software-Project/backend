import { Request, Response } from "express";
import { DashboardService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface StaffRequest extends Request {
	user: UserWithRoles;
}

const StaffDashboardController = {
	async getDashboard(req: StaffRequest, res: Response): Promise<void> {
		try {
			const dashboard = await DashboardService.getDashboard();
			res.status(200).json(dashboard);
		} catch (error: any) {
			console.log(
				"dashboard.controller.js: getDashboard: error: ",
				error
			);
			res.status(500).json({ message: error.message });
		}
	},
};

export default StaffDashboardController;
