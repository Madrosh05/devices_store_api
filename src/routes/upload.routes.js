const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

console.log("Ruta de upload cargada");

// Proteger las rutas con autenticación
router.use(authMiddleware);

// Agrega logging para debugging
router.post('/', async (req, res, next) => {
  console.log('Headers recibidos:', req.headers);
  console.log('Token recibido:', req.headers.authorization);
  try {
    await uploadImage(req, res);
  } catch (error) {
    console.error('Error en upload:', error);
    next(error);
  }
});

router.delete('/:public_id', deleteImage);

module.exports = router;
