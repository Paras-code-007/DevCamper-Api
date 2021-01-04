const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all courses
// @route   GET /api/v1/courses/
// @route   GET /api/v1/bootcamps/:bootcampId/courses/
// @access  Public
exports.getCourses = asyncHandler(async function (req, res, next) {
	let query;
	if (req.params.bootcampId) {
		const course = Course.find({
			bootcamp: req.params.bootcampId,
		}).populate('bootcamp', 'name description');

		if (!course) {
			return next(new ErrorResponse('no data found', 500));
		}
		return res.status(200).json({
			success: true,
			data: course,
			msg: `Get course with id ${req.params.bootcampId}`,
		});
	} else {
		// query = Course.find().populate({
		// 	path: 'bootcamp', //schema feild to populate
		// 	select: 'name description',
		// });
		res.status(200).json(res.advanceResults);
	}
	// let pagination;
	// const data = await query;

	// res.status(200).json({
	// 	success: true,
	// 	count: data.length,
	// 	data,
	// 	pagination,
	// 	msg: req.params.bootcampId ? `show all courses in bootcamp ${req.params.bootcampId}` : 'show all courses',
	// });
});

// @desc    Get single courses
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const data = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!data) {
		return next(new ErrorResponse(`course not found with id ${req.params.id}`), 404);
	}

	res.status(200).json({
		success: true,
		data,
		msg: `get course with Id: ${req.params.id}`,
	});
});

// @desc    Add single courses related to a specefic bootcamp
// @route   POST /api/v1/bootcamps/:bootcampId/courses/
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
	const asscBootcamp = await Bootcamp.findById(req.params.bootcampId);
	if (!asscBootcamp) {
		return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`), 404);
	}

	// if user loginned is not owner of bootcamp
	if (asscBootcamp.user.toString() !== req.user.id && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(
				`${req.user.role} with userid: ${req.user.id} id not authorize add a course to this bootcamp with id: ${asscBootcamp._id}`,
				403
			)
		);
	}

	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const data = await Course.create(req.body);
	// console.log(data);

	res.status(200).json({
		success: true,
		data,
		msg: `created course with Id: ${data._id} corresponding to bootcamp Id: ${req.body.bootcamp}`,
	});
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponse(`course not found with id ${req.params.id}`), 404);
	}

	// if user loginned is not owner of course
	if (course.user.toString() !== req.user.id && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(
				`${req.user.role} with userid: ${req.user.id} is not authorize to update this course with id: ${course._id}`,
				403
			)
		);
	}

	const data = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		success: true,
		data,
		msg: `updated course with Id: ${req.params.id}`,
	});
});

// @desc    delete courses
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const data = await Course.findById(req.params.id);
	// const data = await Course.findByIdAndDelete(req.params.id);

	if (!data) {
		return next(new ErrorResponse(`course not found with id ${req.params.id}`), 404);
	}

	// if user loginned is not owner of course
	if (data.user.toString() !== req.user.id && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(
				`${req.user.role} with userid: ${req.user.id} is not authorize to delete this course with course id: ${data._id}`,
				403
			)
		);
	}

	let deletedcourse = data;
	await data.remove();

	res.status(200).json({
		success: true,
		data: deletedcourse,
		msg: `deleted course with Id: ${req.params.id}`,
	});
});
