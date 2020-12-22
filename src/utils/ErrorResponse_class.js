class ErrorResponse extends Error {
	constructor(message, statusCode, errorObject, ...params) {
		super(message);
		this.statusCode = statusCode;
		// this.name = errorObject.name;
		// this.errorMessage = errorObject.message;
		//
		// this.name = Error.prototype.name;
	}
}

module.exports = ErrorResponse;
