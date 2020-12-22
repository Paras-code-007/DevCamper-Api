const ErrorResponse = require('../utils/ErrorResponse_class');

function errorHandler(err, req, res, next) {
	// Log to console for dev
	// console.log('next called');
	/* console.log(`Error name: ${err.name}`);
		console.log(`Error message: ${err.message}`);
		res.status(400).json({
			success: false,
			data: null,
			error: err.name,
			msg: 'some error occured',
        }); */
	// +OR
	/* console.log(err.stack);
		res.status(500).json({
			success: false,
			error: err.message,
        }); */
	console.log(`Error name: ${err.name}`);
	console.log(`Error message: ${err.message}`);
	// console.log(`Error stack: ${err.stack}`);
	console.log(`Error reason: ${err.reason}`);
	console.log(err);

	let error = { data: null, ...err };
	// in spread operator only first level properties are copied (properties of mongoose extended class of error)
	// for internal Error class proerties we need to access them using object.property

	error.name = err.name;
	error.message = err.message;
	error.stack = err.stack;
	// console.log(error);

	// Mongoose bad object id Error
	if (err.name === 'CastError') {
		const message = `Resource is not found with id of ${err.value}: Invalid id format error`;
		error = new ErrorResponse(message, 404);
	}

	// mongoose duplication key
	if (err.code === 11000) {
		const message = 'Duplicate feild value entered';
		error = new ErrorResponse(message, 400);
	}

	// mongoose Validation Error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.name || 'Error',
		message: error.message || 'Server Error',
	});
}

module.exports = errorHandler;
