// @desc logs the request to console
const logger = (req, res, next) => {
	console.log(`${req.method}  ${req.protocol}://${req.hostname}${req.originalUrl}`);
	// console.log(req);
	// req.hello = 'World';
	next();
};

module.exports = logger;
