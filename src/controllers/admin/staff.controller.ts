import { Request, Response } from "express";
import { UserService, UserRoleService } from "../../services";
import { sendEmail } from "../../utils";

export default {
	getStaffById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const staff = await UserService.getUserById(Number(id));

			if (!staff) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			if (!staff.roles.includes("STAFF")) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			return res.json(staff);
		} catch (error) {
			console.error("StaffController.getStaffById error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	getAllStaff: async (req: Request, res: Response) => {
		try {
			const staff = await UserService.getAllStaff();
			return res.json(staff);
		} catch (error) {
			console.error("StaffController.getAllStaff error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	createStaff: async (req: Request, res: Response) => {
		try {
			const { email, name, surname } = req.body;

			const { status, message, user } = await UserService.createStaff({
				email,
				name,
				surname,
			});

			if (status !== "OK") {
				return res.status(400).json({ message });
			}

			const emailHtml = `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h1 style="color: #333;">Welcome ${name} ${surname}!</h1>
					<p style="color: #666; font-size: 16px;">You have been added as a staff member to our platform. We're excited to have you join our team!</p>
					${
						user?.password
							? `
					<div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
					<p style="color: #333; font-size: 16px; margin: 0;">Your email is: <strong>${email}</strong></p>
					<p style="color: #333; font-size: 16px; margin: 0;">Your password is: <strong>${user.password}</strong></p>
					</div>
					`
							: ""
					}
					<p style="color: #666; font-size: 14px;">If you have any questions, please don't hesitate to contact the admin team.</p>
				</div>
			`;

			await sendEmail({
				to: email,
				subject: "Welcome to Our Team - Staff Account Created",
				html: emailHtml,
			});

			return res.status(201).json({ message });
		} catch (error) {
			console.error("StaffController.createStaff error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	updateStaff: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const { name, surname } = req.body;

			const staff = await UserService.getUserById(Number(id));

			if (!staff) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			if (!staff.roles.includes("STAFF")) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			const updated = await UserService.updateUserById(Number(id), {
				name,
				surname,
			});

			if (!updated) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			return res.json({ message: "Staff member updated successfully" });
		} catch (error) {
			console.error("StaffController.updateStaff error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	deleteStaff: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const staff = await UserService.getUserById(Number(id));

			if (!staff) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			if (!staff.roles.includes("STAFF")) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			const deleted = await UserRoleService.deleteUserRole({
				userId: Number(id),
				role: "STAFF",
			});

			if (!deleted) {
				return res
					.status(404)
					.json({ message: "Staff member not found" });
			}

			return res.json({ message: "Staff member deleted successfully" });
		} catch (error) {
			console.error("StaffController.deleteStaff error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},
};
