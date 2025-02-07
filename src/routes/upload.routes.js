const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

console.log("Ruta de upload cargada");

// Proteger las rutas con autenticación
router.use(authMiddleware);

// Agrega logging para debugging
router.post('/', async (req, res, next) => {
  console.log('Headers completos:', req.headers);
  console.log('Método de la petición:', req.method);
  console.log('URL de la petición:', req.originalUrl);
  
  try {
    await uploadImage(req, res);
  } catch (error) {
    console.error('Error detallado en upload:', error);
    next(error);
  }
});

router.delete('/:public_id', deleteImage);

module.exports = router;
