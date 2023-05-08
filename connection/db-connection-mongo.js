//importar mongoose:
const mongoose = require('mongoose');

//importar dotenv para las variables de entorno
require('dotenv').config(); 
const usuarioAtlas = process.env.user;
const passAtlas = process.env.pass;
const dataBase = process.env.db;

//crear funcion getConnection asincrona:
const getConnection = async () => {
  try {
      const url = `mongodb+srv://${usuarioAtlas}:${passAtlas}@cluster0.8yblfnr.mongodb.net/${dataBase}?retryWrites=true&w=majority`;
      await mongoose.connect(url);
      console.log('conexion exitosa');
  } catch (error) {
      console.log('error en la conexion');
  }
}

//permitir exportar la función:
module.exports = {
  getConnection,
}