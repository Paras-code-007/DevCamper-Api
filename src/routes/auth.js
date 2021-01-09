const router = require('express').Router();
const {
	register,
	login,
	verifyRegisterUser,
	forgotPassword,
	resetPassword,
	logoutUser,
} = require('../controllers/auth');
const { checkIfLogin } = require('../middlewares/auth');
const { getMe, updateMe, deleteMe } = require('../controllers/me');

router.post('/register', register);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/register/verify/:registerId', verifyRegisterUser);
router.post('/login', login);
router.get('/logout', logoutUser);

router.route('/me').get(checkIfLogin, getMe).put(checkIfLogin, updateMe).delete(checkIfLogin, deleteMe);

module.exports = router;
