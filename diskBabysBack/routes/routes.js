const express = require('express');

const userController = require('../controllers/user')
const { authenticateToken } = require('../middlewares/authentication');
const productController = require('../controllers/product')
const cartController = require('../controllers/cart')
const orderController = require('../controllers/order')



const router = express.Router();

//rotas do usuario
router.get('/all', userController.getAllUsers)
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/user', userController.getUser)
router.put('/user', authenticateToken, userController.putUser);
router.put('/user/picture', authenticateToken, userController.putPicture);
router.delete('/user/:id', authenticateToken, userController.deleteUser);
// Rotas do produto
router.get('/user/shop', productController.getAllProducts)
router.get('/user/shop/:pid', productController.getProduct)
router.get('/user/shop/cart/:pid', productController.getProductForCart)
router.post('/product', authenticateToken,  productController.addProduct)
router.delete('/product/:pid', authenticateToken, productController.deleteProduct)
router.put('/product', authenticateToken, productController.putProduct)
//Rotas do carrinho
router.get('/user/cart/:id', cartController.getCart)
router.post('/user/cart', cartController.addToCart)
router.delete('/user/cart/:cid', cartController.deleteCartItem)
router.delete('/user/cart/clear/:id', cartController.deleteAllCartItems)
router.get('/user/cart/items/:id', cartController.numItem)
router.get('/user/cart/price/:id', cartController.totalPrice)
router.post('/user/order', authenticateToken, cartController.addToOrder)
//Rotas do pedido
router.get('/order/requests',authenticateToken,orderController.getAllRequets)
router.get('/order/requests/:id',authenticateToken, orderController.getOrder)



module.exports = router;