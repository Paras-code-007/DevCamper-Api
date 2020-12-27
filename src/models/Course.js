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

// statics and method in mongoose
// statics are function called on model
// Course => model imported into a variable in some controller file
// Course.goFish()
// and method are schema properties in form of function which are called on a crated document
// data= await Course.find()
// data.goFish()
// static is on the model and method is on whatever you create/get from the model

CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{ $match: { bootcamp: bootcampId } },
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' },
				totalCost: { $sum: '$tuition' },
			},
		},
	]);
	// console.log(obj);
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost),
			totalCost: Math.ceil(obj[0].totalCost),
		});
	} catch (err) {
		console.log(err);
	}
};

// maintain courses feild in model Bootcamp
CourseSchema.statics.maintainCourses = async function (bootcampId, courseId) {
	// console.log('maintainCourses run');
	// console.log(this._id);
	try {
		const data = await this.model('Bootcamp').update({ _id: bootcampId }, { $push: { courses: courseId } });
		// console.log(data.courses);
	} catch (err) {
		console.log('err.name', err.name);
		console.log('err.message', err.message);
	}
};

// call getAverageCost after save
CourseSchema.post('save', function (next) {
	this.constructor.getAverageCost(this.bootcamp);
	// this.constructor.maintainCourses(this.bootcamp);
	// console.log(this._id);
	// next();
	// !Error name: TypeError Error message: next is not a function
});

// call getAverageCost before remove
CourseSchema.pre('remove', function (next) {
	this.constructor.getAverageCost(this.bootcamp);
	// this.constructor.maintainCourses(this.bootcamp);
	next();
});

const Course = mongoose.model('Course', CourseSchema);
console.log(Course);

module.exports = Course;
