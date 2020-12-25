const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please enter a name'],
	},
	description: {
		type: String,
		required: [true, 'Please enter a description'],
	},
	weeks: {
		type: Number,
		required: [true, 'Please enter number of weeks for the course'],
	},
	tuition: {
		type: Number,
		max: [20000, 'Course cannot be greater than 20000'],
		required: [true, 'Please add a tution cost'],
	},
	minimumSkill: {
		type: String,
		enum: ['beginner', 'intermediate', 'advanced'],
		required: [true, 'Please add a minimum skill'],
	},
	scholarhipsAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	bootcamp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
});
const Course = mongoose.model('Course', CourseSchema);
console.log(Course);

module.exports = Course;
