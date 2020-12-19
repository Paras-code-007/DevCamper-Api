const route = require('express').Router();

route.get('/', function (req, res) {
	res.status(200).json({
		success: true,
		data: null,
		msg: 'show all bootcamps',
	});
});

route.get('/:id', function (req, res) {
	res.status(200).json({
		success: true,
		data: null,
		msg: `get bootcamp ${req.params.id}`,
	});
});

route.post('/', function (req, res) {
	res.status(200).json({
		success: true,
		data: null,
		msg: 'created new bootcamp',
	});
});

route.put('/:id', function (req, res) {
	res.status(200).json({
		success: true,
		data: null,
		msg: `Updated bootcamp ${req.params.id}`,
	});
});

route.delete('/:id', function (req, res) {
	res.status(200).json({
		success: true,
		data: null,
		msg: `Deleted bootcamp ${req.params.id}`,
	});
});

module.exports = {
	route,
};
// module.exports = route;
