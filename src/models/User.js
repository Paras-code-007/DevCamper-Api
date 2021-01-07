const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please add a name'],
	},
	email: {
		type: String,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'please add a valid email address',
		],
		required: [true, 'Please add a email address'],
		unique: true,
	},
	role: {
		type: String,
		enum: ['User', 'Publisher'],
		default: 'User',
	},
	password: {
		type: String,
		minlength: 8,
		required: [true, 'please add a password'],
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: String,
	TwoFAKey: {
		type: String,
		select: false,
	},
	// TwoFAKeyValidity: String,
	verifyStatus: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	// this.password;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashpass = await bcrypt.hash(this.password, salt);
		this.password = hashpass;
	} catch (err) {
		console.log('Error name:', err.name);
		console.log('Error message:', err.message);
	}
	next();
});

// Sign JWT and return
// statics are called on model and methods are called on objects/document created on a model
UserSchema.methods.getSignedJwtToken = function () {
	// synchronous with default algorithm
	// secret does not get base64 encoded before token generation
	let token = jwt.sign(
		{
			id: this._id,
			// iat: Date.now(),  //automatically created and since its default value is date.now therfore all token created of the same user will be differrent because of differrent timestamps
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
			subject: 'some@user.com',
			issuer: 'DevcamperSecAssociate',
			audience: this.role,
		}
	);

	//+ Using RSA aLgo
	/* const fs = require('fs');
	const privateKey = fs.readFileSync(__dirname + '/../../private.key', 'utf8');
	const publicKey = fs.readFileSync(__dirname + '/../../public.key', 'utf8');

	console.log(privateKey);
	console.log(process.env.RSA_PRIVATEKEY);

	let token = jwt.sign({ id: this._id, iat: Date.now() }, privateKey, {
		algorithm: 'RS256',
		expiresIn: process.env.JWT_EXPIRE,
		subject: 'some@user.com',
		issuer: 'DevcamperSecAssociate',
		audience: this.role,
	}); */
	// console.log(token);
	return token;
};

// Match Password send by user
UserSchema.methods.matchPassword = async function (passwordEntered) {
	// console.log(passwordEntered);
	// console.log(this);
	return await bcrypt.compare(passwordEntered, this.password);
};

// Generate Reset Password Token
UserSchema.methods.generateResetPassToken = async function () {
	const buf = crypto.randomBytes(20);

	// Give a 256 byte reset token because of SHA
	const resetToken = buf.toString('hex');
	const hashResetToken = await crypto.createHash('SHA256').update(resetToken).digest('hex');

	this.resetPasswordToken = hashResetToken;
	// this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', UserSchema);
console.log(User);
module.exports = User;

// !for RS256 algo
// !Error name: Error Error message: error:0909006C:PEM routines:get_name:no start line Error reason: no start line
// !need RSA keys which start with a header and end with footer, therfore errors says it cant read header
