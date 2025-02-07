const cloudinary = require('../config/cloudinary');
const { HTTP_STATUS } = require('../config/constants');

exports.uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      console.log('No se recibió imagen');
      return res.status(400).json({ 
        message: 'No se proporcionó una imagen' 
      });
    }

    console.log('Procesando imagen...');
    
    // Validar el formato de la imagen
    if (!imageBase64.match(/^data:image\/(jpeg|png|jpg|gif);base64,/)) {
      console.log('Formato inválido');
      return res.status(400).json({
        message: 'Formato de imagen no válido. Se aceptan: JPEG, PNG, JPG, GIF'
      });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'products',
      resource_type: 'image',
      transformation: [
        { width: 1000, crop: "limit" },
        { quality: "auto" }
      ]
    });

    console.log('Imagen subida exitosamente:', result.secure_url);

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ 
      message: 'Error al procesar la imagen',
      error: error.message 
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Se requiere el public_id de la imagen'
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Error al eliminar la imagen',
      error: error.message
    });
  }
};
