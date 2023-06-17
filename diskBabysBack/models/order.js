const db = require('../util/database');
const FileSave = require('../util/save');

module.exports = class order{
    constructor(){}

    
      
    static fetchAll() {
        return db.execute('SELECT * FROM pedido');
    }

    static find(order) {
        return new Promise((resolve, reject) => {
          db.execute('select * from pedido where id = ?', [order.id])
            .then(([rows]) => {
              resolve(rows);
            })
            .catch(error => {
              reject({ message: 'Erro ao buscar os Pedidos', error });
            });
        });
      }
      
      


};
