const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID inválido'
    });
  }

  res.status(500).json({
    message: 'Error interno del servidor'
  });
};

module.exports = errorHandler; 