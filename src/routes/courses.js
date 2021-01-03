const router = require('express').Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advanceResults = require('../middlewares/advanceResults');
const { checkIfLogin } = require('../middlewares/auth');
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
	.post(checkIfLogin, addCourse);

router.route('/:id').get(getCourse).put(checkIfLogin, updateCourse).delete(checkIfLogin, deleteCourse);

module.exports = router;
