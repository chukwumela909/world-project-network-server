const express = require('express');
const { userRegister, userLogin, getUser, } = require('../controllers/auth-controller');
const { protectUser, } = require('../middlewares/authMiddleware');


const router = express.Router();

//user routes
router.post('/user-register', userRegister);
router.post('/user-login', userLogin);
router.get('/user', protectUser, getUser);



module.exports = router;