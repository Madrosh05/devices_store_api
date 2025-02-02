const { body } = require('express-validator');

const validators = {
  product: [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('category').trim().notEmpty().withMessage('La categoría es requerida'),
    body('stock').optional().isInt().withMessage('El stock debe ser un número entero')
  ],

  device: [
    body('serialNumber').trim().notEmpty().withMessage('El número de serie es requerido'),
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('type').trim().notEmpty().withMessage('El tipo de dispositivo es requerido')
  ],

  status: [
    body('status')
      .isIn(['active', 'inactive', 'maintenance'])
      .withMessage('Estado inválido')
  ]
};

module.exports = validators; 