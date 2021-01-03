const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth');
const { checkIfLogin } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', checkIfLogin, getMe);

module.exports = router;
