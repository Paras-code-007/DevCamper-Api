const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');

// @desc    Get all user
// @route   GET /api/v1/users/
// @access  Admin/Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advanceResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Admin/Private
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorResponse('User does not exist'), 404);
	} //when id format is correct and we do not get eny error and any user therfore we genrate a error

	// user.find will give error when id format is incorrect in thta case err.name= "Cast Error" and we give a custom error message as a response in that case mentioned in error handler middleware

	res.status(200).json({
		success: true,
		data: user,
		msg: `show user with id: ${user._id}`,
	});
});

// @desc    Create new user
// @route   POST /api/v1/users/
// @access  Admin/Private
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		success: true,
		data: user,
		msg: `created user with id: ${user._id}`,
	});
});

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Admin/Private
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return next(new ErrorResponse('User does not exist'), 404);
	}

	res.status(200).json({
		success: true,
		data: user,
		msg: `updated user with id: ${user._id}`,
	});
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Admin/Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new ErrorResponse('User does not exist'), 404);
	}

	res.status(200).json({
		success: true,
		data: user,
		msg: `deleted user with id: ${user._id}`,
	});
});
