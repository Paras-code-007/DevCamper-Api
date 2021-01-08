const { checkIfLogin, authorize } = require('../middlewares/auth');
const advanceResults = require('../middlewares/advanceResults');
const User = require('../models/User');
const {
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	getUnverifiedUsers,
	deleteUnverifiedUsers,
} = require('../controllers/users');

const router = require('express').Router();

// for Admin Only
router.use(checkIfLogin, authorize('Admin'));

router.route('/').get(advanceResults(User), getAllUsers).post(createUser);

router.route('/unverifiedusers').get(advanceResults(User), getUnverifiedUsers).delete(deleteUnverifiedUsers);

// if parameter not unverified user then this route will run (/api/v1/users/unverifiedusers and /api/v1/users/:id were conflicting)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
