const router = require('express').Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advanceResults = require('../middlewares/advanceResults');
const { checkIfLogin, authorize } = require('../middlewares/auth');
const Course = require('../models/Course');

router
	.route('/')
	.get(
		// advanceResults(Course, {
		// 	path: 'bootcamp', //schema feild to populate
		// 	select: 'name description',
		// }),
		advanceResults(Course, 'bootcamp', 'name description'),
		getCourses
	)
	.post(checkIfLogin, authorize('Admin', 'Publisher'), addCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(checkIfLogin, authorize('Admin', 'Publisher'), updateCourse)
	.delete(checkIfLogin, authorize('Admin', 'Publisher'), deleteCourse);

module.exports = router;
