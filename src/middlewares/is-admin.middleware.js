const isAdmin = (req, res, next) => {
	const isAuthenticated = req.isAuthenticated();

	if (!isAuthenticated)
		return res.status(401).json({ message: "Unauthenticated" });

	const user = req.user;

	if (!user) return res.status(401).json({ message: "Unauthenticated" });

	if (!user.roles.includes("admin"))
		return res.status(403).json({ message: "Unauthorized" });

	return next();
};

export default isAdmin;
