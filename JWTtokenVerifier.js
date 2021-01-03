// JWT Token Verifier
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({
	path: __dirname + '/../../config/config.env',
});
// console.log(dotenv);
console.log(process.env.JWT_SECRET);
console.log(process.argv[2]);

try {
	const decoded = jwt.verify(process.argv[2], process.env.JWT_SECRET, {
		algorithms: 'HS256',
		issuer: 'DevcamperSecAssociate',
	});
	console.log('\x1b[1m\x1b[7m\x1b[32m%s\x1b[0m', 'Token Verified');

	// console.log(decoded);
} catch (err) {
	console.log('\x1b[1m\x1b[7m\x1b[31m%s\x1b[0m', 'Token Not Verified');
}

//+OR

// const decoded = jwt.verify(
// 	process.argv[2],
// 	process.env.JWT_SECRET,
// 	{
// 		algorithms: 'HS256',
// 		issuer: 'DevcamperSecAssociate',
// 	},
// 	function (err, decoded) {
// 		if (err) {
// 			return console.log('\x1b[1m\x1b[7m\x1b[31m%s\x1b[0m', 'Token not verified');
// 		}
// 		console.log('\x1b[1m\x1b[7m\x1b[32m%s\x1b[0m', 'Token verified');
// 	}
// );
