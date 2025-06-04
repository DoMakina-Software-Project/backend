import { Router } from "express";
import { StaffValidator } from "../validators";
import { StaffController } from "../../../controllers/admin";
import { throwValidationErrors } from "../validators";

const router = Router();

// Get all staff members
router.get("/", StaffController.getAllStaff);

// Create new staff member
router.post(
	"/",
	StaffValidator.createStaffValidation,
	throwValidationErrors,
	StaffController.createStaff
);

// Get staff member by id
router.get(
	"/:id",
	StaffValidator.getStaffByIdValidation,
	throwValidationErrors,
	StaffController.getStaffById
);

// Update staff member
router.put(
	"/:id",
	StaffValidator.updateStaffValidation,
	throwValidationErrors,
	StaffController.updateStaff
);

// Delete staff member
router.delete(
	"/:id",
	StaffValidator.deleteStaffValidation,
	throwValidationErrors,
	StaffController.deleteStaff
);

export default router;
