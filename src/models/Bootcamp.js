const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
			unique: true,
			trim: true,
			maxlength: [50, 'name cannot be more than 50 characters'],
		},
		slug: String, //slug is shortedned url allowed string for bootcampname
		description: {
			type: String,
			required: [true, 'Please add a description'],
			maxlength: [500, 'Desciption cannot be more than 500 characters'],
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please add a valid URL with http/https',
			],
		},
		phone: {
			type: String,
			maxlength: [20, 'phone number cannot be greater than 20 digits'],
			required: true,
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'please add a valid email address',
			],
			required: true,
		},
		address: {
			type: String,
			required: [true, 'please add an address'],
		},
		// GeoJSON object reqd feilds=> type and coordinates
		location: {
			// GeoJSON Point
			type: {
				type: String,
				enum: ['Point'],
				// required: true,
			},
			coordinates: {
				type: [Number],
				// required: true,
				index: '2dsphere',
			},
			// from mapQuest API/Geocoder
			formattedAddress: String,
			street: String,
			city: String,
			state: String,
			zipcode: String,
			country: String,
		},
		careers: {
			type: [String],
			required: true,
			enum: [
				'Web Development',
				'Mobile Development',
				'UI/UX',
				'Data Science',
				'Machine Learning and AI',
				'Business',
				'DS Algo',
				'Others',
			],
		},
		averageRating: {
			type: Number,
			max: [10, 'Rating cannot be more than 10'],
			min: [1, 'Raing cannot be less than 1'],
		},
		averageCost: Number,
		photo: {
			type: String, //just gonna be the filename data upload process will be handle by multer
			default: 'no-photo.jpg', //for default photo we will supply this from our file system
		},
		housing: {
			type: Boolean,
			default: false,
		},
		jobAssistance: {
			type: Boolean,
			default: false,
		},
		jobGuarantee: {
			type: Boolean,
			default: false,
		},
		acceptGi: {
			type: Boolean,
			default: false,
		},
		// courses: {
		// 	type: [Object],
		// },
		// not get created because when courses are added having specefic bootcamp courseid is not saved in bootcamp
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// mongooose middlewares
// create slug from the name
BootcampSchema.pre('save', function (next) {
	// console.log('Slugify', this.name);
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Geocode and location feild
BootcampSchema.pre('save', async function (next) {
	let loc = await geocoder.geocode(this.address);
	loc = loc[0];
	this.location = {
		type: 'Point',
		coordinates: [loc.latitude, loc.longitude],
		formattedAddress: loc.formattedAddress,
		street: loc.streetName,
		city: loc.city,
		state: loc.stateCode,
		country: loc.country || loc.countryCode,
		zipcode: loc.zipcode,
	};

	// no need to save address in db therfore
	this.address = undefined;
	next();
});

// Reverse Populate with virtuals(create a nonpersistent feild)
BootcampSchema.virtual('courses', {
	//feildtoBeCreated, optionsForRelationship
	ref: 'Course',
	localField: '_id',
	foreignField: 'bootcamp',
	justOne: false, //for multiple relationship (one to many)/array
});

// delete related courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
	await this.model('Course').deleteMany({
		bootcamp: this._id,
	});
	next();
});

// compiling the schema into a model class
const Bootcamp = mongoose.model('Bootcamp', BootcampSchema);
console.log(Bootcamp);

module.exports = Bootcamp;

// !MongoError Error:  E11000 duplicate key error collection: devcamper.bootcamps index: name_1 dup key: { name: "Devworks Bootcamp" }
