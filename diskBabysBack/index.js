const express = require('express');
const bodyParser = require('body-parser');
const Routes = require('./routes/routes');

const app = express();
const PORT = 3000;

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Configuração do body-parser para lidar com o tamanho do payload
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', Routes); 

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
