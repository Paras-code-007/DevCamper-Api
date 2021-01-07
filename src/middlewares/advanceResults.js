// function inside a function where async req,res,next is the callback function

const advanceResults = (model, populate, populateFeilds) => async (req, res, next) => {
	//function further returning a function
	req.params.id && next();
	try {
		let querystr = JSON.stringify(req.query);
		const removefeilds = ['select', 'sort', 'page', 'limit'];
		// console.log(querystr);
		querystr = querystr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`); //{{URI}}/api/v1/bootcamps?averageCost[lte]=10000&careers[in]=Business
		// console.log(querystr);
		querystr = JSON.parse(querystr);
		removefeilds.forEach((feild) => delete querystr[feild]);
		// console.log(querystr);
		let data = model.find(querystr);
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
		let totaldocs = await model.countDocuments();
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

		// populate
		if (populate) {
			data = data.populate(populate, populateFeilds);
		}

		// executing query
		data = await data;

		res.advanceResults = {
			success: true,
			count: data.length,
			pagination,
			data,
			msg: `show all resources`,
		};

		res.statuscode = 200;
		// console.log(res.advanceResults);
		next();
		// res.status(200).json({
		// 	success: true,
		// 	count: data.length,
		// 	pagination,
		// 	data,
		// 	msg: 'show all bootcamps',
		// 	// hello: req.hello,
		// });
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
			// next();
			console.log('Error name', err.name);
			console.log('Error message', err.message);
			res.status(500).json({
				success: false,
				error: 'Internal Server error',
				data: 'null',
				msg: 'some interal error occurred, Please try again later',
			});
		}
	}
};

module.exports = advanceResults;

// !Cannot set property 'sendData' of undefined
