import { DashboardService } from "../../services/index.js";

export default {
	getDashboard: async (_, res) => {
		try {
			const dashboard = await DashboardService.getDashboard();
			return res.status(200).json(dashboard);
		} catch (error) {
			console.log(
				"dashboard.controller.js: getDashboard: error: ",
				error
			);
			return res.status(500).json({ message: error.message });
		}
	},
};
