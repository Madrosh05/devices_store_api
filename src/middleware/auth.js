const admin = require('../config/firebase');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: 'Token no proporcionado' 
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken.email?.endsWith('@horusautomation.com')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.UNAUTHORIZED_EMAIL 
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
      message: ERROR_MESSAGES.INVALID_TOKEN 
    });
  }
};

module.exports = authMiddleware;