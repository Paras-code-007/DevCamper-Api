const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse_class');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all reviews or get all reviews of a particular bootcamp
// @route   GET /api/v1/reviews/
// @route   GET /api/v1/bootcamps/:bootcampId/reviews/
// @access  Public
exports.getReviews = asyncHandler(async function (req, res, next) {
	let query;
	if (req.params.bootcampId) {
		const asscBootcamp = await Bootcamp.findById(req.params.bootcampId);
		if (!asscBootcamp) {
			return next(new ErrorResponse(`bootcamp not found with id ${req.params.bootcampId}`), 404);
		}

		const reviews = await Review.find({
			bootcamp: req.params.bootcampId,
		}).populate('bootcamp', 'name description');

		if (!reviews) {
			return next(new ErrorResponse(`no reviews found`, 500));
		}

		return res.status(200).json({
			success: true,
			data: reviews,
			// msg: `Get reviews of bootcamp ${req.params.bootcampId} ${reviews.bootcamp.name}`,  //Error name: TypeError Error message: Cannot read property 'name' of undefined
		});
	} else {
		res.status(200).json(res.advanceResults);
	}
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
	const data = await Review.findById(req.params.id)
		.populate({
			path: 'bootcamp',
			select: 'name description',
		})
		.populate('user', 'name');

	if (!data) {
		return next(new ErrorResponse(`review not found with id ${req.params.id}`), 404);
	}

	res.status(200).json({
		success: true,
		data,
		msg: `get review with Id: ${req.params.id}`,
	});
});

// @desc    Add review related to a specefic bootcamp
// @route   POST /api/v1/bootcamps/:bootcampId/reviews/
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
	if (!req.params.bootcampId) {
		return next(new ErrorResponse('Inavlid Request', 400));
	}

	const asscBootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!asscBootcamp) {
		return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`), 404);
	}

	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const data = await Review.create(req.body);

	res.status(200).json({
		success: true,
		data,
		msg: `created review with Id: ${data._id} on the bootcamp with Id: ${req.body.bootcamp}`,
	});
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(new ErrorResponse(`review not found with id ${req.params.id}`), 404);
	}

	// if user loginned is not owner of review
	if (review.user.toString() !== req.user.id && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(
				`${req.user.role} with userid: ${req.user.id} is not authorize to update this review with id: ${review._id}`,
				403
			)
		);
	}

	console.log(req.body);

	// Sanatize the update query
	delete req.body.user;
	delete req.body.bootcamp;

	console.log(req.body);

	const data = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	// .populate('user', 'name')
	// .populate('bootcamp', 'name');  //for testing purposes

	res.status(200).json({
		success: true,
		data,
		msg: `updated review with Id: ${req.params.id}`,
	});
});

// @desc    delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const data = await Review.findById(req.params.id);

	if (!data) {
		return next(new ErrorResponse(`review not found with id ${req.params.id}`), 404);
	}

	// if user loginned is not owner of review
	if (data.user.toString() !== req.user.id && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(
				`${req.user.role} with userid: ${req.user.id} is not authorize to delete this review with review id: ${data._id}`,
				403
			)
		);
	}

	await data.remove();

	res.status(200).json({
		success: true,
		data,
		msg: `deleted review with Id: ${req.params.id}`,
	});
});

// if not awaited a query
// Error name: TypeError
// Error message: Converting circular structure to JSON
//     --> starting at object with constructor 'NativeTopology'
//     |     property 's' -> object with constructor 'Object'
//     |     property 'sessionPool' -> object with constructor 'ServerSessionPool'
//     --- property 'topology' closes the circle
// Error reason: undefined
