const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No se proporcionó una imagen' });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'uploads',
      resource_type: 'image',
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
