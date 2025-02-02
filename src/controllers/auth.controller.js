const User = require('../models/user.model');
const admin = require('../config/firebase');

const authController = {
  async login(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      if (!decodedToken.email?.endsWith('@horusautomation.com')) {
        return res.status(403).json({ 
          message: 'Acceso denegado. Solo se permiten correos de @horusautomation.com' 
        });
      }

      let user = await User.findOne({ email: decodedToken.email });
      
      if (!user) {
        user = new User({
          email: decodedToken.email,
          uid: decodedToken.uid
        });
      }

      user.loginHistory.push({
        timestamp: new Date(),
        device: req.headers['user-agent'],
        ip: req.ip
      });

      await user.save();

      res.json({
        user,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findOne({ uid: req.user.uid });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async logout(req, res) {
    try {
      // Registrar el logout en el historial
      const user = await User.findOne({ uid: req.user.uid });
      if (user) {
        user.loginHistory[user.loginHistory.length - 1].logoutTime = new Date();
        await user.save();
      }
      res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController; 