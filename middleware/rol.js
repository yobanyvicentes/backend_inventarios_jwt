const { request, response } = require("express");
require('dotenv').config();

const esAdmin = (req = request, res = response, next) =>{
    try {
        if (! req.user) {
            return res.status(500).json({
                msg: "Debe validar el token",
                error
            });
        };
        const {rol} = req.user;
        if (rol !== "admin") {
            return res.status(403).json({
                msg: "Usuario sin permisos necesarios",
                error
            });
        };
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "token invalido",
            error
        });
    }
}

module.exports = esAdmin;
