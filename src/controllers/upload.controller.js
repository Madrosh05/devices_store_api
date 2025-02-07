const cloudinary = require('../config/cloudinary');
const { HTTP_STATUS } = require('../config/constants');

exports.uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: 'No se proporcionó una imagen' 
      });
    }

    // Validar el formato de la imagen
    if (!imageBase64.match(/^data:image\/(jpeg|png|jpg|gif);base64,/)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Formato de imagen no válido. Se aceptan: JPEG, PNG, JPG, GIF'
      });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'products', // Organizar por carpetas
      resource_type: 'image',
      transformation: [
        { width: 1000, crop: "limit" }, // Limitar tamaño máximo
        { quality: "auto" } // Optimización automática
      ]
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
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
