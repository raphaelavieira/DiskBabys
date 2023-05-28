const Product = require('../models/product');
const { all } = require('../routes/routes');
var fs = require('fs');
var fsp = require('fs').promises;

exports.getAllProducts = async (req, res, next) => {
    try {
        const [allProducts] = await Product.fetchAll();
        for (var product of allProducts) {
            product.picture = "data:image/jpeg;base64," + await fsp.readFile("../diskBabysBack/assets/products/" + product.foto, 'base64');
        }
        res.status(200).json(allProducts);
    } catch {
        console.log('Error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProduct = async (req, res, next) => {
    const pid = req.params.pid;
    try {
        const productDetails = {
            pid: pid
        };
        const [prod] = await Product.find(productDetails);
        for (var product of prod) {
            product.picture = "data:image/jpeg;base64," + await fsp.readFile("../diskBabysBack/assets/products/" + product.picture, 'base64');
        }
        if (prod.length > 0) { //check if there was any matches
            res.status(202).json(prod[0]);
            console.log('success');
        }
        else {
            res.status(404).json(prod[0]);
        }

    } catch {
        console.log('Error');
    }

};

exports.getProductForCart = async (req, res, next) => {
    const pid = req.params.pid;
    try {
        const productDetails = {
            pid: pid
        };
        const [prod] = await Product.find(productDetails);
        if (prod.length > 0) { //check if there was any matches
            res.status(202).json(prod[0]);
            console.log('success');
        }
        else {
            res.status(404).json(prod[0]);
        }

    } catch {
        console.log('Error');
    }
};

exports.addProduct = async (req, res, next) => {
    const { product_name, description, price, picture } = req.body;
  
    if (!picture) {
      res.status(200).json({ status: false, message: 'Imagem é obrigatoria' });
      return;
    }
    if (!description) {
        res.status(200).json({ status: false, message: 'Descrição é obrigatoria' });
        return;
    }
    if (!product_name) {
        res.status(200).json({ status: false, message: 'Nome do produto é obrigatorio' });
        return;
    }
    if (!price) {
        res.status(200).json({ status: false, message: 'Preço do produto é obrigatorio' });
        return;
    }
  
    const productDetails = {
      product_name,
      description,
      price,
      picture
    };
  
    try {
      await Product.post(productDetails);
      res.status(200).json({ status: true, message: 'Produto criado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Erro interno no servidor' });
    }
  };
  

  exports.deleteProduct = async (req, res, next) => {
    try {
      console.log(req.params.pid);
      const deleteResponse = await Product.delete(req.params.pid);
      res.status(200).json({ success: true, message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.log('Error:', error);
      res.status(200).json({ success: false, message: 'Erro ao excluir o produto' });
    }
  };
  

exports.putProduct = async (req, res, next) => {
    const { pid, product_name, description, price, picture } = req.body;
  
    const productDetails = {
      pid,
      product_name,
      description,
      price,
      picture
    };
  
    try {
      let response;
  
      if (!picture || typeof picture === 'undefined') {
        response = await Product.updateWithoutPicture(productDetails);
      } else {
        response = await Product.updateWithPicture(productDetails);
      }
  
      res.status(200).json({ success: true, message: 'Produto atualizado com sucesso' });
    } catch (error) {
      console.log('Error:', error);
      res.status(200).json({ success: false, message: 'Erro ao atualizar o produto' });
    }
  };
  
  
  