const db = require('../util/database');
const FileSave = require('../util/save');

module.exports = class order{
    constructor(){}

    
      
    static fetchAll() {
        return db.execute('SELECT * FROM pedido');
    }


      


};
