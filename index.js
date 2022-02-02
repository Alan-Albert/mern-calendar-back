const express = require('express');
const { json } = require('express/lib/response');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

//crear servidor express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//escuchar peticiones
app.listen(4000, () => {
	console.log(`Servidor corriendo en ${process.env.PORT}`);
});