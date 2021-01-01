const router = require('express').Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advanceResults = require('../middlewares/advanceResults');
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
	.post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
