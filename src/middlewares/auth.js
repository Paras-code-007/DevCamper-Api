const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const User = require('../models/User');

// @desc check if login for protected private routes
exports.checkIfLogin = asyncHandler(async function (req, res, next) {
	let token;

	// check if token exist
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
		// console.log('header token');
	} else if (req.cookies.DevcamperToken) {
		token = req.cookies.DevcamperToken;
		// console.log('cookie token');
	}
	// console.log(token);
	// console.log(req);

	if (!token) {
		return next(new ErrorResponse('Not authorize to access this route => token not exist', 401));
	}

	// verify the token
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
			algorithms: 'HS256',
			issuer: 'DevcamperSecAssociate',
		});

		// const fs = require('fs');
		// fs.readFileSync(__dirname + '/../../public.key', 'utf8');
		// const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
		// 	algorithm: 'RS256',
		// 	issuer: 'DevcamperSecAssociate',
		// });

		// console.log(decodedToken);

		req.user = await User.findById(decodedToken.id);
		next();
	} catch (err) {
		// Token is not valid
		console.log('Error: Token not verified');
		return next(new ErrorResponse('Not authorize to access this route => token not valid', 401));
	}
});
