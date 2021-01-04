const geocoder = require('../utils/geocoder');
const path = require('path');
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
	// if (err) {
	// return next(err);
	// }
	if (res.advanceResults) res.status(res.statuscode).json(res.advanceResults);
	else return next(new ErrorResponse());
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
	req.body.user = req.user.id;

	const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id });
	if (publishedBootcamps && req.user.role !== 'Admin') {
		return next(
			new ErrorResponse(`The ${req.user.role} with id: ${req.user.id} has already published a bootcamp`, 400)
		);
	}

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
	// const data = await Bootcamp.findByIdAndDelete(req.params.id);  //pre remove middleware not work with findbyIdanddelete
	// const data = await Bootcamp.findByIdAndRemove(req.params.id);  //not work either (pre remove event not triggerred)
	const data = await Bootcamp.findById(req.params.id); //not work either (pre remove event not triggerred)
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
	deletedbootcamp = data;
	data.remove();
	res.status(200).json({
		success: true,
		data: deletedbootcamp,
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

// @desc    Upload bootcamp photo
// @route   POST /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
	// console.log(req.files);

	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
	}

	if (!req.files) {
		return next(new ErrorResponse('Please upload a file', 400));
	}
	const file = req.files.file;

	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse('Please upload a image as a file', 400));
	}

	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(`Please upload a image less than size: ${process.env.MAX_FILE_UPLOAD / 1024}kb`, 400)
		);
	}

	// file.name = `photo_${bootcamp.id}`;
	file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;
	// console.log(path.parse(file.name));
	// console.log(file.name);
	// console.log(file);
	// console.log(req.headers);
	// console.log(req.headers['content-type']);
	// __dirname, `../../images/${file.name}.${file.mimetype.split('/')[1]}`
	// path.join(__dirname, `../../images/${file.name}`)
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async function (err) {
		if (err) {
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			// return res.status(500).send(err.name);
			return next(new ErrorResponse('Error in uploading file, please try again', 500));
		}

		const data = await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		// res.send('File uploaded!');
		res.status(200).json({
			success: true,
			// data: data.photo,
			data: file.name,
			msg: 'File successfully uploaded',
		});
	});

	// file.name= req.params.id
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
