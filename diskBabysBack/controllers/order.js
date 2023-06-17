const Order = require('../models/order');
const { all } = require('../routes/routes');
const salvarArquivo = require('../util/save');
var fs = require('fs');
var fsp = require('fs').promises;
const validator = require('validator');
const jwt = require('jsonwebtoken');


exports.getAllRequets = async (req, res, next) =>{
    try{
        const [allORequests] = await Order.fetchAll();
        res.status(200).json(allORequests);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: 'Erro ao buscar os Pedidos', error });
    }
};

exports.getOrder = async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    try {
      const order = await Order.find({ id: id });
      if (order.length > 0) {
        res.status(200).json(order);
        console.log('Success');
      } else {
        res.status(200).json([]);
        console.log('Nenhum Pedidos encontrado');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar os Pedidos' });
    }
  };
  
  
  