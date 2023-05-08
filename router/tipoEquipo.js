//importar el modelo Tipo Equipo
const TipoEquipo = require('../models/TipoEquipo');
//importar Router desde express
const {Router} = require('express');
const router = Router();
const validarjwt = require('../middleware/token');
const esAdmin = require('../middleware/rol');

//importar el modelo Usuario
//const Usuario;

router.get('/',  validarjwt, async function(req,res){
    try {
        const tipoEquipos = await TipoEquipo.find();
        res.send(tipoEquipos);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

router.post('/', validarjwt,  esAdmin, async function(req,res){
    try {
        const tipoExiste = await TipoEquipo.findOne({nombre: req.body.nombre});
        if(tipoExiste){
            return res.status(400).send('Tipo de equipo existente, pruebe con otro');
        };

        let tipoEquipo = TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date;
        tipoEquipo.fechaActualizacion = new Date;

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);
    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

router.put('/:TipoID', validarjwt,  esAdmin, async function(req,res){
    try {
        let tipoEquipo = await TipoEquipo.findById(req.params.TipoID);
        if(!tipoEquipo){
            return res.status(400).send('el Tipo del Equipo a aactualizar no existe')
        };

        const nombreExistente = await TipoEquipo.findOne({nombre: req.body.nombre, _id:{$ne: tipoEquipo._id}});
        if(nombreExistente){
            return res.status(400).send('el nombre del Tipo Equipo ya existe en otro documento');
        };

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date;

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);

    } catch (error) {
        res.status(500).send('hubo un error');
    }
});

module.exports = router;
