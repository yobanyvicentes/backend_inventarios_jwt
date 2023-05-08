//importar Router desde express
const {Router} = require('express');
const { register} = require('../controllers/auth');
const router = Router();
const validarjwt = require('../middleware/token')
//importar el modelo Usuario
const UsuarioSys = require('../models/UsuarioSys');
const esAdmin = require('../middleware/rol');

router.get('/', validarjwt,  async function(req,res){
    try {
        const usuarios = await UsuarioSys.find();
        res.send(usuarios);
    } catch (error) {
        res.status(500).send('hay un error');
    }
});

//___________________________________________________________________________________________________________

router.post('/', validarjwt,  esAdmin, register);

//___________________________________________________________________________________________

router.put('/:usuarioId',  validarjwt,  esAdmin, async function(req,res){
    try {

        //se valida si el usuario no existe
        let usuario = await UsuarioSys.findById(req.params.usuarioId);
        if(!usuario){
            return res.status(400).send('usuario no existe');
        }

        //si no entró en lo anterior, entonces si existe
        //entonces se valida que el nuevo email a poner, no lo tenga otro usuario
        const emailExistente = await UsuarioSys.findOne({email: req.body.email, _id:{ $ne: usuario._id}});
        if(emailExistente){
            return res.status(400).send('el email ya está asignado a otro usuario distinto al que está intentando actualizar')
        }

        //setear los parámetros de la request a
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.password = req.body.password;
        usuario.rol = req.body.rol;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date;
        //guardar en bd
        usuario = await usuario.save();

        res.send(usuario);
    } catch (error) {
        res.status(500).send('error')
    }
});
//____________________________________________________________________________________________________________

module.exports = router;
