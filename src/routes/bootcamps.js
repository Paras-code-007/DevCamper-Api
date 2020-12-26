const router = require('express').Router();
const {
	getAllBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampByRadius,
} = require('../controllers/bootcamp');

// Include Other Resource Routers
const courseRouter = require('./courses');

// Reroute into other resource router
router.use('/:bootcampId/courses', courseRouter); //means mount this route to the course router

// new syntax
router.route('/').get(getAllBootcamps).post(createBootcamp); //IRoute syntax for common route paths

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.get('/radius/:zipcode/:distance', getBootcampByRadius);

//+OR
// route.get('/', getAllBootcamps);
// route.get('/:id', getBootcamp);
// route.post('/', createBootcamp);
// route.put('/:id', updateBootcamp);
// route.delete('/:id', deleteBootcamp);

module.exports = {
	router,
};
// module.exports = router;
