const admin = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Verificar el dominio del correo
    if (!decodedToken.email?.endsWith('@horusautomation.com')) {
      return res.status(403).json({ 
        message: 'Acceso denegado. Solo se permiten correos de @horusautomation.com' 
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware; 