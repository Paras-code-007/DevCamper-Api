const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');

// @desc    Get the current loggined User/Me(Personal Profile)
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	// const user = req.user;
	//+OR
	console.log('hello');
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: user,
		msg: `${user.name} Profile`,
	});
});

// @desc    Update the current logged in user details
// @route   PUT /api/v1/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
	let user;
	if (req.body.password && req.body.currentPassword) {
		user = await User.findById(req.user.id).select('+password');

		const isMatch = await user.matchPassword(req.body.currentPassword);
		if (!isMatch) {
			return next(new ErrorResponse('Password did not match with earlier password, Plz try again', 400));
		}

		user.password = req.body.password;
		// await user.save({ validateBeforeSave: true });

		res.status(200).json({
			success: true,
			data: user,
			msg: `${user.name} Profile`,
		});
	}

	if (req.body.email) {
		user = await User.findOne({ email });

		if (user) {
			return next(new ErrorResponse('User with that email already exist!!', 400));
		}

		// generate 2FA Key
		const buf = await crypto.randomBytes(256);
		const hash2FAKey = crypto.createHash('SHA256').update(buf.toString('hex')).digest('hex');
		console.log(hash2FAKey);

		const hash2FALink = `${req.protocol}://${req.get('host')}/api/v1/auth/register/verify/${hash2FAKey}`;

		await sendMail({
			email: user.email,
			subject: 'Verify Your DevCamper Account',
			bodyText: `Dear ${user.name}, \n Click on this link to verify your account \n ${hash2FALink}`,
			bodyHtml: `<h2>Dear ${user.name},</h2> \n <h4>Click on this link to verify your account \n <br><a>${hash2FALink}</a></h4>`,
		});

		user.email = req.body.email;
		user.verifyStatus = false;
		// await user.save({ validateBeforeSave: true });
		// logout now
	}

	if (req.body.name) user.name = req.body.name;
	if (req.body.role) user.role = req.body.role;

	await user.save({ validateModifiedOnly: true });
});

// @desc    Delete the current loggined User
// @route   DELETE /api/v1/auth/me
// @access  Private
exports.deleteMe = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorResponse('You need to provide email and password in order to delete your account'));
	}

	if (email !== req.user.email) {
		return next(new ErrorResponse('You are not authorized to delete this account'), 403);
	}

	const user = await User.findOne({ email }).select('+password');

	if (!(await user.matchPassword(password))) {
		return next(new ErrorResponse('You are not authorized to delete this account'), 403);
	}

	user.password = undefined;
	await user.remove();

	res.status(200).json({
		success: true,
		data: user,
		msg: `deleted user ${user.name} from database`,
	});
});
