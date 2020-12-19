// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: null,
		msg: 'show all bootcamps',
	});
};

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: null,
		msg: `get bootcamp ${req.params.id}`,
	});
};

// @desc    POST all bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: null,
		msg: 'created new bootcamp',
	});
};

// @desc    PUT all bootcamps
// @route   PUT /api/v1/bootcamps
// @access  Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: null,
		msg: `Updated bootcamp ${req.params.id}`,
	});
};

// @desc    DELETE all bootcamps
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: null,
		msg: `Deleted bootcamp ${req.params.id}`,
	});
};
