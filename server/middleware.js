const simpleAuth = pass => (req, res, next) => {
	if (req.headers["Authorization"] === `Simple ${pass}`) return next();

	res.status(401).send({
		msg: "You aren't authorised to view this resource.",
	});
};

module.exports = { simpleAuth };
