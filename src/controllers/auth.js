const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const User = require('../models/User');

// @desc    Register a User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	// res.status(200).json({
	// 	success: true,
	// });
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	const token = user.getSignedJwtToken();
	// console.log(token);

	// not working
	// delete user['password'];
	// delete user.password;
	// console.log(typeof user);
	// const temp = delete user.password;
	// console.log(temp);
	// console.log(user);

	user.password = undefined;

	res.status(201).json({
		success: true,
		data: user,
		token,
		msg: `registered user successfully with token`,
	});
});
