function errorHandler(err, req, res, next) {
	if (err) {
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
		console.log(err.stack);
		res.status(500).json({
			success: false,
			error: err.message,
		});
	}
}

module.exports = errorHandler;
