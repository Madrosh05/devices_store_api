const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones, por favor intente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = apiLimiter;