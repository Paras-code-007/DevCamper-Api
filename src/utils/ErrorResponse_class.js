class ErrorResponse extends Error {
	constructor(message, statusCode, ...params) {
		super(message);
		this.statusCode = statusCode;
		// this.name = Error.prototype.name;
	}
}

module.exports = ErrorResponse;
