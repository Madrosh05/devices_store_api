const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    message: 'Demasiadas peticiones desde esta IP, por favor intente nuevamente en 15 minutos'
  }
});

module.exports = apiLimiter; 