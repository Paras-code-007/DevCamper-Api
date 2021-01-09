const router = require('express').Router({ mergeParams: true });
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
const advanceResults = require('../middlewares/advanceResults');
const { checkIfLogin, authorize } = require('../middlewares/auth');
const Review = require('../models/Review');

router
	.route('/')
	.get(advanceResults(Review, 'bootcamp', 'name description'), getReviews)
	.post(checkIfLogin, authorize('User', 'Admin'), addReview);

router
	.route('/:id')
	.get(getReview)
	.put(checkIfLogin, authorize('User', 'Admin'), updateReview)
	.delete(checkIfLogin, authorize('User', 'Admin'), deleteReview);

module.exports = router;
