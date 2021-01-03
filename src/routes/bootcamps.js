const router = require('express').Router();
const {
	getAllBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampByRadius,
	uploadPhoto,
} = require('../controllers/bootcamp');
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middlewares/advanceResults');
const { checkIfLogin } = require('../middlewares/auth');

// Include Other Resource Routers
const courseRouter = require('./courses');

// Reroute into other resource router
router.use('/:bootcampId/courses', courseRouter); //means mount this route to the course router

// new syntax
router
	.route('/')
	.get(advanceResults(Bootcamp, 'courses', 'title description'), getAllBootcamps)
	.post(checkIfLogin, createBootcamp); //IRoute syntax for common route paths

router.route('/:id').get(getBootcamp).put(checkIfLogin, updateBootcamp).delete(checkIfLogin, deleteBootcamp);

router.route('/:id/photo').post(checkIfLogin, uploadPhoto).put(checkIfLogin, uploadPhoto);

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
