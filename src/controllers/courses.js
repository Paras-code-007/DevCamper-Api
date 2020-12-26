const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/v1/courses and /api/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async function (req, res, next) {
	let query;
	if (req.params.bootcampId) {
		query = Course.find({
			bootcamp: req.params.bootcampId,
		});
	} else {
		query = Course.find();
	}

	const data = await query;

	res.status(200).json({
		success: true,
		count: data.length,
		data,
		msg: req.params.bootcampId ? `show all courses in bootcamp ${req.params.bootcampId}` : 'show all courses',
	});
});
