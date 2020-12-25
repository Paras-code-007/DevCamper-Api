const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse_class');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamps = async (req, res, next) => {
	// console.log(req.hello); //Prints World
	// console.log(req.query);
	// console.log(req.query.averageSalary.lte);
	// console.log(typeof req.query.averageSalary);
	let querystr = JSON.stringify(req.query);
	const removefeilds = ['select', 'sort', 'page', 'limit'];
	// console.log(querystr);
	querystr = querystr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`); //{{URI}}/api/v1/bootcamps?averageCost[lte]=10000&careers[in]=Business
	// console.log(querystr);
	querystr = JSON.parse(querystr);
	removefeilds.forEach((feild) => delete querystr[feild]);
	// console.log(querystr);
	try {
		let data = Bootcamp.find(querystr);
		// for select query
		if (req.query.select) {
			selectfeilds = req.query.select.split(',').join(' ');
			// console.log(selectfeilds);
			data = data.select(selectfeilds);
		}
		// for sort query
		if (req.query.sort) {
			sortfeilds = req.query.sort.split(',').join(' ');
			// console.log(sortfeilds);
			data = data.sort(sortfeilds);
		} else {
			//default
			data = data.sort('-createdAt');
		}
		// for pagination and limit query
		// console.log(req.query.page, req.query.limit);  //req.query.key are string therfore used parseint
		// console.log(typeof req.query.page, typeof req.query.limit);
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		let pagination = {};
		const prevPage = (page - 1) * limit;
		const nextPage = page * limit;
		let totaldocs = await Bootcamp.countDocuments();
		if (prevPage > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}
		if (nextPage < totaldocs) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
		let skipfeilds = (page - 1) * limit;
		data = data.skip(skipfeilds).limit(limit);

		data = await data;
		res.status(200).json({
			success: true,
			count: data.length,
			pagination,
			data,
			msg: 'show all bootcamps',
			// hello: req.hello,
		});
		//? keys having undefined values are not passed in res.json or are automatically removed from response body or removed when json is parsed
	} catch (err) {
		/* console.log(`Error name: ${err.name}`);
		console.log(`Error message: ${err.message}`);
		res.status(400).json({
			success: false,
			data: null,
			error: err.name,
			msg: 'some error occured',
		}); */
		if (err) {
			// next(err);
			// next(new ErrorResponse('Error Fetching bootcamps', 404));
			next(err);
		}
	}
};

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	// console.log(req.params.id);
	const data = await Bootcamp.findById(req.params.id);
	if (!data) {
		/* return res.status(400).json({
			success: false,
			error: 'inavlid id',
			data,
			// msg: `some error occured`,
		}); */
		// return next(err)
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}: Invalid Id error`, 404));
		// err = new Error();
		// err.name = 'CastError';
		// return next(err);
	}
	res.status(200).json({
		success: true,
		data,
		msg: `get bootcamp ${req.params.id}`,
	});
	// try {
	// } catch (err) {
	// 	// console.log(`Error name: ${err.name}`);
	// 	// console.log(`Error message: ${err.message}`);
	// 	// res.status(400).json({
	// 	// 	success: false,
	// 	// 	error: err.name,
	// 	// 	data: null,
	// 	// 	msg: `some error occured/ invalid id format`,
	// 	// });
	// 	// error handled by next middleware errorHandler.js
	// 	if (err) {
	// 		// next(err);
	// 		// next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}: Invalid Id format`, 404));
	// 		next(err);
	// 	}
	// }
});

// @desc    POST all bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	// console.log(req.body);
	/* try {

	} catch (err) {
		// handled error will not be displayed red
		// console.log('\x1b[31m%s\x1b[0m', `Error name: ${err.name}`);
		// console.log('\x1b[31m%s\x1b[0m', `Error message: ${err.message}`);
		//
		// console.log(`Error name: ${err.name}`);
		// console.log(`Error message: ${err.message}`);
		// res.status(400).json({
		// 	success: false,
		// 	error: err.name,
		// 	msg: 'error occured/ duplicate name key',
		// });
		next(err);
	} */
	const data = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data,
		msg: 'created new bootcamp',
	});
	// later we create error handler (asynchandle) and remove try catch so we dont have to handle error using trycatch
});

// @desc    PUT all bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
		useFindAndModify: false,
	});
	if (!data) {
		// return res.status(400).json({
		// 	success: false,
		// 	data: null,
		// 	msg: `Invalid id ${req.params.id}`,
		// 	error: 'some error occured',
		// });
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}: Invalid Id error`, 404));
	}
	res.status(200).json({
		success: true,
		data,
		msg: `Updated bootcamp ${req.params.id}`,
	});
	// try {
	// } catch (err) {
	// 	// console.log(`Error name: ${err.name}`);
	// 	// console.log(`Error message: ${err.message}`);
	// 	// res.status(400).json({
	// 	// 	success: false,
	// 	// 	data: null,
	// 	// 	error: 'invalid id format',
	// 	// 	msg: `bootcamp ${req.params.id} does not exist`,
	// 	// });
	// 	next(err);
	// }
});

// @desc    DELETE all bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const data = await Bootcamp.findByIdAndDelete(req.params.id);
	// console.log(data);
	if (!data) {
		// return res.status(400).json({
		// 	success: false,
		// 	data: null,
		// 	msg: `Invalid id ${req.params.id}, bootcamp does not exist`,
		// 	error: 'some error occured',
		// });
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}: Invalid Id error`, 404));
	}
	res.status(200).json({
		success: true,
		data,
		msg: `Deleted bootcamp ${req.params.id}`,
	});
	// try {
	// } catch (err) {
	// 	// console.log(`Error name: ${err.name}`);
	// 	// console.log(`Error message: ${err.message}`);
	// 	// res.status(400).json({
	// 	// 	success: false,
	// 	// 	data: null,
	// 	// 	error: 'invalid id format',
	// 	// 	msg: `bootcamp ${req.params.id} does not exist`,
	// 	// });
	// 	next(err);
	// }
});

// @desc    Get bootcamps by radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampByRadius = asyncHandler(async (req, res, next) => {
	const loc = await geocoder.geocode(req.params.zipcode);
	const radius = req.params.distance / 3963;
	const data = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[loc[0].longitude, loc[0].latitude], radius] } },
	});
	// console.log(data);
	res.status(200).json({
		success: true,
		count: data.length,
		data,
		msg: `get bootcamps within radius ${req.params.distance}`,
	});
});

// Errors ********************************************************

// can do exports.function or can use module.exports= an object with all property functions

// ! const data = Bootcamp.findById(req.params.id);
/*
!TypeError
Error: Converting circular structure to JSON
    --> starting at object with constructor 'NativeTopology'
    |     property 's' -> object with constructor 'Object'
    |     property 'sessionPool' -> object with constructor 'ServerSessionPool'
	--- property 'topology' closes the circle
*/
// Solution=> I also ran into this issue. It was because I forgot to await for a promise.

// When id format does not match
// !Error name: CastError Error message: Cast to ObjectId failed for value "5fdf4ee28f64a1bb52820229999" at path "_id" for model "Bootcamp"

// when id format matches but id that id does not has any document then no error given by model.findbyid(), so to handle it see that are we getting a document object returned by id or not
// response on a invalid id (no error)
/*
{
    "success": true,
    "data": null,
    "msg": "get bootcamp 5fdf4ee28f64a1bb52820228"
}
 */

//! Error: Cannot set headers after they are sent to the client
// when headers are set after response is send

// !(node:50557) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify

// const data = await findByIdAndDelete(req.params.id);
// !Error name: MongooseError Error message: `Model.findByIdAndDelete()` cannot run without a model as `this`. Make sure you are calling `MyModel.findByIdAndDelete()` where `MyModel` is a Mongoose model.
// Solution=> const data = await BootCamp.findByIdAndDelete(req.params.id);

// !Error Connecting to the Database MongooseServerSelectionError :Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist: https://docs.atlas.mongodb.com/security-whitelist/

// const data = await Bootcamp.find({location: { $geoWithin: { $centerSphere: [[loc[0].longitude, loc[0].latitude], radius] } },});
// ! Error name: MongoError Error message: Point must only contain numeric elements
