const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const User = require('../models/User');
const crypto = require('crypto');
const { sendMail } = require('../utils/sendMail');

// @desc    Register a User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	// res.status(200).json({
	// 	success: true,
	// });
	const { name, email, password, role } = req.body;

	// if user already exist
	let user = await User.findOne({ email });
	if (user) {
		return next(new ErrorResponse('User Alredy Exist!! Try Login or forgot password'), 400);
	}

	// generate 2FA Key
	const buf = await crypto.randomBytes(256);
	// console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
	const hash2FAKey = crypto.createHash('SHA256').update(buf.toString('hex')).digest('hex');
	console.log(hash2FAKey);

	user = await User.create({
		name,
		email,
		password,
		role,
		TwoFAKey: hash2FAKey,
		// TwoFAKeyValidity: Date.now() + 60 * 60 * 1000,
		verifyStatus: false,
	});

	// const token = user.getSignedJwtToken();
	// console.log(token);

	// not working
	// delete user['password'];
	// delete user.password;
	// console.log(typeof user);
	// const temp = delete user.password;
	// console.log(temp);
	// console.log(user);

	user.password = undefined;
	user.TwoFAKey = undefined;
	// user.TwoFAKeyValidity = undefined;

	const hash2FALink = `${req.protocol}://${req.get('host')}/api/v1/auth/register/verify/${hash2FAKey}`;

	await sendMail({
		email: user.email,
		subject: 'Verify Your DevCamper Account',
		bodyText: `Dear ${user.name}, \n Click on this link to verify your account \n ${hash2FALink}`,
		bodyHtml: `<h2>Dear ${user.name},</h2> \n <h4>Click on this link to verify your account \n <br><a>${hash2FALink}</a></h4>`,
	});

	res.status(200).json({
		success: true,
		data: user,
		msg: "Unverified users can't login, Visit your emailId to verify",
	});

	// at register sent token means after register user is logged in
	// res.status(201).json({
	// 	success: true,
	// 	data: user,
	// 	token,
	// 	msg: `registered user successfully with token`,
	// });
	//+OR
	// Login after register
	// sendTokenResponse(user, 201, res, true);
});

// @desc    Verify a User
// @route   GET /api/v1/auth/register/verify/:registerId
// @access  Public
exports.verifyRegisterUser = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({
		TwoFAKey: req.params.registerId,
		// TwoFAKeyValidity: {
		// 	$gt: Date.now(),
		// },  //if 2FAKey expires then there is no way to generate it again because it is only made in register
	});

	if (!user) {
		return next(new ErrorResponse('Invalid Token', 400));
	}

	user.verifyStatus = true;
	user.TwoFAKey = undefined;
	// user.TwoFAKeyValidity = undefined;
	await user.save({ validateBeforeSave: true });

	// sendTokenResponse(user, 201, res, true);
	//+ OR
	res.status(200).json({
		success: true,
		data: user,
		msg: 'Successfuly verified and created user, redirect to login, statusCode 301',
	});
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

	if (!user.verifyStatus) {
		return next(new ErrorResponse('Please verify first in order to login', 403));
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
	sendTokenResponse(user, 200, res, false);
});

// @desc    Get the current loggined User/Me(Personal Profile)
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	// const user = req.user;
	//+OR
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: user,
		msg: `${user.name} Profile`,
	});
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const email = req.body.email;
	if (!email) {
		return next(new ErrorResponse('Please provide a email addresss', 400));
	}
	const user = await User.findOne({ email });

	if (!user) {
		return next(new ErrorResponse('There is no user with that Email', 404));
	}

	if (!user.verifyStatus) {
		return next(new ErrorResponse('You need to verify first in order to access this route', 403));
	}

	// Get reset token
	const resetToken = await user.generateResetPassToken();
	console.log(resetToken);

	await user.save({ validateBeforeSave: false });

	// create reset url
	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
	// const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`; //PUT  for resetting password

	const message = `You are receiving this mail because you/someone else have requested for reseting password. Please make a put request to: \n\n ${resetUrl}`;

	try {
		await sendMail({
			email: user.email,
			subject: 'Password Reset Token',
			bodyText: message,
			bodyHtml: message,
		});
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorResponse('Email Could not be sent ', 500)); //Internal server error
	}

	res.status(200).json({
		success: true,
		msg: `Mail has been sent to ${user.email} regarding password reset`,
	});
});

// Get Token from model, create cookie and send response
// not hoisted but still works before before the file is fully executed before request comes to any of the above path functions
const sendTokenResponse = function (user, statusCode, res, isPathRegister) {
	const token = user.getSignedJwtToken();

	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), //Date.now gives time in ms from epoch time
		// signed: process.env.COOKIE_SECRET,
		secure: process.env.NODE_ENV === 'production' ? true : false,
	};

	res.status(statusCode)
		.cookie('DevcamperToken', token, cookieOptions)
		.json({
			success: true,
			data: isPathRegister ? user : undefined,
			token,
			msg: `${isPathRegister ? 'Registered' : 'Logined'} user successfully`,
		});
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// get token from url and dehash it/compare
	// get hashed token
	let resetPasswordToken = crypto.createHash('SHA256').update(req.params.resetToken).digest('hex');

	// Token validity check and get user if token valid
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: {
			$gt: Date.now(),
		},
	}).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid Token', 400));
	}

	if (!req.body.password) {
		return next(new ErrorResponse('Please enter the new password', 400));
	}

	// If Password matches old password
	const isPrevPass = await user.matchPassword(req.body.password);
	if (isPrevPass) {
		return next(new ErrorResponse('Please enter the new password', 400));
	}

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save(); //validate for password length

	sendTokenResponse(user, 203, res, false);

	// res.status(200).json({
	// 	success: true,
	// 	data: user,
	// 	msg: `${user.name} Profile`,
	// });
});
