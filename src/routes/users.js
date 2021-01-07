const { checkIfLogin, authorize } = require('../middlewares/auth');
const advanceResults = require('../middlewares/advanceResults');
const User = require('../models/User');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const router = require('express').Router();

router.use(checkIfLogin, authorize('Admin'));

router.route('/').get(advanceResults(User), getAllUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
