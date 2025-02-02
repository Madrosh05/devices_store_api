const router = require('express').Router();
const productController = require('../controllers/products.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router; 