//importar el modelo bd de Marca
const Marca = require('../models/Marca');
//importar Router desde express
const {Router} = require('express');
const router = Router();
const validarjwt = require('../middleware/token');
const esAdmin = require('../middleware/rol');
//importar el modelo Usuario
//const Usuario;

router.get('/', validarjwt,  async function(req,res){
try {
    const marcas = await Marca.find();
    res.send(marcas);
} catch (error) {
    res.status(500).send('hay un error');
}
});

router.post('/',  validarjwt,  esAdmin, async function(req,res){
    try {
//en la colección de marcas buscame por nombre aquel que coincida
//con el parametro "nombre" que viene en el body de la request
        const marcaExistente = await Marca.findOne({nombre: req.body.nombre});
        if(marcaExistente){
//se agrega el "return" para que no siga ejecutando las siguientes instrcciones y no vuelva a crear otro registro
            return res.status(400).send('marca existente, pruebe con otro nombre de marca')
        };

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date;
        marca.fechaActualizacion = new Date;

//guardar en la bd
        marca = await marca.save();

        res.send(marca);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

router.put('/:idMarca',  validarjwt,  esAdmin, async function(req,res){
    try {
        let marca = await Marca.findById(req.params.idMarca);
        if(!marca){
            return res.status(400).send('la marca a actualizar no existe');
        };

        const marcaExistente = await Marca.findOne({nombre: req.body.nombre, _id:{$ne: marca._id}});
        if(marcaExistente){
            return res.status(400).send('el nombre ya está asignado a otra marca distinta a la que está intentando actualizar')
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date;

        marca = await marca.save();

        res.send(marca);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

module.exports = router;
