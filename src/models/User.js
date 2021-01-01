const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', async function (next) {
	// this.password;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashpass = await bcrypt.hash(this.password, salt);
		this.password = hashpass;
	} catch (err) {
		console.log('Error name', err.name);
		console.log('Error message', err.message);
	}
	next();
});

const User = mongoose.model('User', UserSchema);
console.log(User);
module.exports = User;
