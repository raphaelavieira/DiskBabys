const express = require('express');

const userController = require('../controllers/user')


const router = express.Router();

//rotas do usuario
router.get('/all', userController.getAllUsers)
router.post('/register', userController.registerUser)
router.get('/login/:email/:password', userController.loginUser)
router.get('/user', userController.getUser)
router.put('/user', userController.putUser)
router.put('/user/picture', userController.putPicture)
router.delete('/user/:id', userController.deleteUser)

module.exports = router;