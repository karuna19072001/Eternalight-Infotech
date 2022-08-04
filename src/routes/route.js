const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

const auth = require('../middleware/auth')

//user related
router.post('/register', userController.register)
router.post('/login', userController.userLogin)
router.put('/:userId/update',auth.auth, userController.updateUser)
router.get('/logout',auth.auth, userController.UserLogout)

module.exports = router