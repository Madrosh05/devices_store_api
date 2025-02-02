const router = require('express').Router();
const deviceController = require('../controllers/devices.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/register', deviceController.register);
router.get('/', deviceController.getAll);
router.put('/:id/status', deviceController.updateStatus);

module.exports = router; 