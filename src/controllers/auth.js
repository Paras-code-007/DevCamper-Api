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

	// at register sent token means after register user is logged in
	res.status(201).json({
		success: true,
		data: user,
		token,
		msg: `registered user successfully with token`,
	});
	//+OR
	// sendTokenResponse(user, 201, res);
});

// @desc    Login a User when user is registered but logout
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate if email and password is eneterd
	if (!email || !password) {
		return next(new ErrorResponse('Please enter email and password', 400));
	}

	// check if user exist
	// const user = await User.findOne({ email }).select('password');  select only the password feild
	const user = await User.findOne({ email }).select('+password'); //select all feilds + password feild
	// console.log(user); //this for any method called on it
	if (!user) {
		return next(new ErrorResponse('Invalid Credentials', 401)); //401 unauthorized
	}

	// check if password matches
	const isMatch = await user.matchPassword(password);
	// console.log(isMatch);
	if (!isMatch) {
		return next(new ErrorResponse('Invalid Credentials', 401));
	}

	// login successful
	/* const token = user.getSignedJwtToken();

	console.log(req.cookies); //[Object: null prototype] {}

	res.status(201).json({
		success: true,
		token,
		msg: `Logined user successfully`,
	}); */
	sendTokenResponse(user, 200, res);
});

// Get Token from model, create cookie and send response
// not hoisted but still works before before the file is fully executed before request comes to any of the above path functions
const sendTokenResponse = function (user, statusCode, res) {
	const token = user.getSignedJwtToken();

	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), //Date.now gives time in ms from epoch time
		// signed: process.env.COOKIE_SECRET,
		secure: process.env.NODE_ENV === 'production' ? true : false,
	};

	res.status(200).cookie('DevcamperToken', token, cookieOptions).json({
		success: true,
		token,
		msg: `Logined user successfully`,
	});
};
