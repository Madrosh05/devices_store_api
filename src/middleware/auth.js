const admin = require('../config/firebase');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    console.log('Token recibido en middleware:', token ? 'Presente' : 'No presente');
    
    if (!token) {
      console.log('No se proporcionó token');
      return res.status(401).json({ 
        message: 'Token no proporcionado' 
      });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token decodificado:', decodedToken.email);
      
      if (!decodedToken.email?.endsWith('@horusautomation.com')) {
        console.log('Email no autorizado:', decodedToken.email);
        return res.status(401).json({ 
          message: ERROR_MESSAGES.UNAUTHORIZED_EMAIL 
        });
      }

      req.user = decodedToken;
      next();
    } catch (verifyError) {
      console.error('Error al verificar token:', verifyError);
      return res.status(401).json({ 
        message: ERROR_MESSAGES.INVALID_TOKEN,
        error: verifyError.message 
      });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(401).json({ 
      message: ERROR_MESSAGES.INVALID_TOKEN,
      error: error.message 
    });
  }
};

module.exports = authMiddleware;