//importar el modelo Usuario
require('dotenv').config();
const UsuarioSys = require('../models/UsuarioSys');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
//importar Router desde express
const { request, response } = require('express');

//metodo register
const register = async (req = request, res = response) => {
    try {
        //validar existencia usuario
        const usuarioSysBD = await UsuarioSys.findOne({email: req.body.email});
        if (usuarioSysBD) {
            return res.status(400).json({
                msg: `ya existe el ususario ${usuarioSysBD}`
            })
        }
        //crear modelo de usuario
        const usuario = new UsuarioSys(req.body);
        usuario.fechaCreacion = new Date;
        usuario.fechaActualizacion = new Date;
        //-----------------------------------------------------------------------
        //cifrar contraseña
        const {password} = await req.body;
        const salt = await bcryptjs.genSalt();
        const passwordEnc = bcryptjs.hashSync(password, salt);
        usuario.password = passwordEnc;
        //------------------------------------------------------------------------
        //guardar en bd el usuario
        const usuarioSaved = await usuario.save();
        //retornar respuesta
        return res.status(201).json(usuarioSaved);
    } catch (error) {
        console.log(error)
        return res.status(500).send("error en la creación del usuario").json();
    }
}

//metodo login
const login = async (req = request, res = response) => {
    try {
        const { email, password } = await req.body;
        //validar existencia usuario
        const usuarioSysBD = await UsuarioSys.findOne({ email });
        if (!usuarioSysBD) {
            return res.status(404).json({
                msg: "no existe ususario"
            })
        };
        //validar que el usuario no este inactivo
        if (usuarioSysBD.estado == 'Inactivo') {
            return res.status(404).json({
                msg: "usuario inactivo"
            })
        };
        //validar que la contraseña sea correcta
        const esPassword = bcryptjs.compareSync(password, usuarioSysBD.password);
        console.log(esPassword);
        if (!esPassword) {
            return res.status(404).json({
                msg: "contraseña incorrecta"
            })
        };
        //generar token
        const TIEMPO_EXPIRATION_HORAS = 24 * 60 * 60 * 1000;
        const payload = {
            usuario: usuarioSysBD.email,
            nombre: usuarioSysBD.nombre,
            rol: usuarioSysBD.rol,
            exp: Date.now() + TIEMPO_EXPIRATION_HORAS
        };
        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY,
        );
        return res.json({ usuarioSysBD, token });
    } catch (error) {
        res.status(500).send('hay un error');
    }
}

module.exports = { register, login };
