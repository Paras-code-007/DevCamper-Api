const route = require('express').Router();
const {
	getAllBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require('../controllers/bootcamp');

route.get('/', getAllBootcamps);

route.get('/:id', getBootcamp);

route.post('/', createBootcamp);

route.put('/:id', updateBootcamp);

route.delete('/:id', deleteBootcamp);

module.exports = {
	route,
};
// module.exports = route;
