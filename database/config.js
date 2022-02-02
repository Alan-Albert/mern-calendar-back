

const mongoose = require('mongoose');

const dbConnection = async( ) => {
    
    try {
        mongoose.connect( process.env.DB_CNN );
        console.log('DB Online');
    } catch (error) {
        console.error(error);
        throw new Error('Error al inicializar la BD');
    }
}

module.exports = {
    dbConnection
}