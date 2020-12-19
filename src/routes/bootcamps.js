const router = require('express').Router();
const {
	getAllBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require('../controllers/bootcamp');

// new syntax
router.route('/').get(getAllBootcamps).post(createBootcamp); //IRoute syntax for common route paths

router.get('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

//+OR
// route.get('/', getAllBootcamps);
// route.get('/:id', getBootcamp);
// route.post('/', createBootcamp);
// route.put('/:id', updateBootcamp);
// route.delete('/:id', deleteBootcamp);

module.exports = {
	route,
};
// module.exports = route;
