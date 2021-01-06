const router = require('express').Router();
const { register, login, getMe, verifyRegisterUser, forgotPassword } = require('../controllers/auth');
const { checkIfLogin } = require('../middlewares/auth');

router.post('/register', register);
router.post('/forgotpassword', forgotPassword);
// router.get('/register/:registerId', verifyRegisterUser);
router.post('/login', login);
router.get('/me', checkIfLogin, getMe);

module.exports = router;
