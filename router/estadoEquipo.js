//importar el modelo Estado Equipo
const EstadoEquipo = require('../models/EstadoEquipo');
//importar Router desde express
const {Router} = require('express');
const router = Router();
const validarjwt = require('../middleware/token');
const esAdmin = require('../middleware/rol');

router.get('/',  validarjwt, async function(req,res){
    try {
        const estadoEquipos = await EstadoEquipo.find();
        res.send(estadoEquipos);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

router.post('/',  validarjwt,  esAdmin, async function(req,res){
    try {
        const estadoExiste = await EstadoEquipo.findOne({nombre: req.body.nombre});
        if(estadoExiste){
            return res.status(400).send('estado de equipo existente, pruebe con otro');
        };

        let estadoEquipo = EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date;
        estadoEquipo.fechaActualizacion = new Date;

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

router.put('/:estadoID', validarjwt,  esAdmin, async function(req,res){
    try {
        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoID);
        if(!estadoEquipo){
            return res.status(400).send('el estado del Equipo a aactualizar no existe')
        };

        const nombreExistente = await EstadoEquipo.findOne({nombre: req.body.nombre, _id:{$ne: estadoEquipo._id}});
        if(nombreExistente){
            return res.status(400).send('el nombre del estado Equipo ya existe en otro documento');
        };

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date;

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);

    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

module.exports = router;
