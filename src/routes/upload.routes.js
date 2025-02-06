const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

console.log("Ruta de upload cargada");

// Proteger las rutas con autenticación
router.use(authMiddleware);

router.post('/', uploadImage);
router.delete('/:public_id', deleteImage);

module.exports = router;
