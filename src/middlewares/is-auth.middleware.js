const isAuth = (req, res, next) => {
	const isAuthenticated = req.isAuthenticated();

	if (!isAuthenticated)
		return res.status(401).json({ message: "Unauthenticated" });
	return next();
};

export default isAuth;
