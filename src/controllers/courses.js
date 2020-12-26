const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
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
	let pagination;
	const data = await query;

	if (!data) {
	}

	res.status(200).json({
		success: true,
		count: data.length,
		data,
		pagination,
		msg: req.params.bootcampId ? `show all courses in bootcamp ${req.params.bootcampId}` : 'show all courses',
	});
});
