//importar las funciones Schema y model directamente de mongoose
//const {<nombre de las funciones a importar separadas por coma>} = require('<fuente, url, ruta o clase>');
const { Schema, model} = require('mongoose');

//crear el modelo UsuariosSchema:
const UsuarioSysSchema = Schema({

    //crear los atributos:
    nombre:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
    },
    rol:{
        type: String,
        enum:['admin',
            'docente'],
    },
    estado:{
        type: String,
        required: true,
        enum:['Activo',
            'Inactivo'],
    },
    fechaCreacion:{
        type: Date,
        required: true,
    },
    fechaActualizacion:{
        type: Date,
        required: true,
    },
});

//exportar el modelo
module.exports = model('UsuarioSys', UsuarioSysSchema);
