const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const router = express.Router();

console.log("Ruta de upload cargada");

router.post('/', uploadImage);

module.exports = router;
