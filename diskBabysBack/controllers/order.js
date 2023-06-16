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
    } catch{
        console.log('Error');
    }
};