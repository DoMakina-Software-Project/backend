import { Request, Response, NextFunction } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
	const isAuthenticated = req.isAuthenticated();

	if (!isAuthenticated) {
		res.status(401).json({ message: "Unauthenticated" });
		return;
	}
	next();
};

export default isAuth;
