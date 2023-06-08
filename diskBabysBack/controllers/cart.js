const Product = require('../models/product');
const Cart = require('../models/cart');
const { all } = require('../routes/routes');
var fs = require('fs');
var fsp = require('fs').promises;

exports.getCart = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cartDetails = {
            id: id
        };
        const [prod] = await Cart.fetchAll(cartDetails);
        for (var product of prod) {
            product.picture = "data:image/jpeg;base64," + await fsp.readFile("../diskBabysBack/assets/products/" + product.foto, 'base64');
        }
        if (prod.length > 0) { 
            res.status(202).json(prod);
            console.log('success');
        }
        else {
            res.status(404).json(prod);
        }

    } catch {
        console.log('Error');
    }

};

exports.addToCart = async (req, res, next) => {
    const id = req.body.id;
    const pid = req.body.pid;
    const product_name = req.body.product_name;
    const picture = req.body.picture;
    const price = req.body.price;

    try {
        const itemDetails = {
            id: id,
            pid: pid,
            product_name: product_name,
            picture: picture,
            price: price
        };

        const postUser = await Cart.post(itemDetails);
        res.status(201).json({ message: 'Item Adicionado' });
    } catch {
        console.log('Error');
    }

};

exports.deleteCartItem = async (req, res, next) => {
    try {
      const deleteResponse = await Cart.delete(req.params.cid);
      res.status(200).json({ status: true, message: "Carrinho deletado" });
    } catch (error) {
      console.log(error);
      res.status(200).json({ status: false, message: "Falha ao deletar carrinho" });
    }
  };
  

exports.deleteAllCartItems = async (req, res, next) => {
    try {
        const deleteResponse = await Cart.deleteAll(req.params.id);
        res.status(200).json(deleteResponse);
    } catch {
        console.log('Error');
    }
};

exports.numItem = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cartDetails = {
            id: id
        };
        const [prod] = await Cart.numItemInCart(cartDetails);
        //res.status(202).json(prod[0]);
        res.send(JSON.stringify(prod[0]['records']));

    } catch {
        console.log('Error');
    }

};

exports.totalPrice = async (req, res, next) => {
    const id = req.params.id;
    try {
        const cartDetails = {
            id: id
        };
        const [prod] = await Cart.cartTotalPrice(cartDetails);
        //res.status(202).json(prod[0]);
        res.send(JSON.stringify(prod[0]['total']));

    } catch {
        console.log('Error');
    }
};

exports.addToOrder = async (req, res, next) => {
    const id = req.body.id;
    const preco_total = req.body.preco_total;
    const forma_pagamento = req.body.forma_pagamento;
    const cep = req.body.cep;
    const rua = req.body.rua;
    const bairro = req.body.bairro;
    const cidade = req.body.cidade;
    const estado = req.body.estado;
    const numero = req.body.numero;
  
    if (!id || !preco_total || !forma_pagamento || !cep || !rua || !bairro || !cidade || !estado || !numero) {
      return res.status(400).json({ error: 'Campos obrigatórios estão em branco' });
    }
  
    try {
      const orderDetails = {
        id: id,
        preco_total: preco_total,
        forma_pagamento: forma_pagamento,
        cep: cep,
        rua: rua,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: numero
      };
  
      const postUser = await Cart.postOrder(orderDetails);
      res.status(201).json({ message: 'Pedido adicionado' });
    } catch {
      console.log('Erro');
    }
  };
  