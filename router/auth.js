//importar Router desde express
const {Router} = require('express');
const router = Router();

//importar el controlador
const {login} = require('../controllers/auth');

//login usuarios
router.post('/login', login);

module.exports = router;


