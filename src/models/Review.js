const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please enter a title'],
	},
	body: {
		type: String,
		required: [true, 'Please enter a body of review'],
	},
	rating: {
		type: Number,
		required: [true, 'Please enter a rating of the bootcamp b/w 1 and 10'],
		min: 1,
		max: 10,
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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{ $match: { bootcamp: bootcampId } },
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating' },
			},
		},
	]);
	// console.log(obj.averageRating);  //!CastError: Cast to Number failed for value "NaN" at path "averageRating"
	// console.log(obj[0]);
	// console.log(obj[0].averageRating);
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageRating: Math.floor(obj[0].averageRating),
		});
	} catch (err) {
		console.log(err);
	}
};

// call getAverageCost after save
ReviewSchema.post('save', function (next) {
	this.constructor.getAverageRating(this.bootcamp);
});

// call getAverageRating before remove
ReviewSchema.pre('remove', function (next) {
	this.constructor.getAverageRating(this.bootcamp);
	next();
});

const Review = mongoose.model('Review', ReviewSchema);
console.log(Review);

module.exports = Review;

/* Error name: MongoError
!Error message: E11000 duplicate key error collection: devcamper.reviews index: bootcamp_1_user_1 dup key: { bootcamp: ObjectId('5ff99342244706c0e4d2b6e4'), user: ObjectId('5ff9935e244706c0e4d2b6e5') }
Error reason: undefined
POST /api/v1/bootcamps/5ff99342244706c0e4d2b6e4/reviews 400 119.318 ms - 75 */
