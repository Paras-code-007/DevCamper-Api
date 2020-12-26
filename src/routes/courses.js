const router = require('express').Router();
const { getCourses } = require('../controllers/courses');

router.route('/').get(getCourses);

module.exports = router;
