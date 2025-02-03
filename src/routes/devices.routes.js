const router = require('express').Router();
const deviceController = require('../controllers/devices.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/register', deviceController.register);
router.get('/', deviceController.getAll);
router.put('/:id/status', deviceController.updateStatus);

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del dispositivo
 *         name:
 *           type: string
 *           description: Nombre del dispositivo
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Estado del dispositivo
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 * /api/devices:
 *   get:
 *     summary: Obtiene todos los dispositivos
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       401:
 *         description: No autorizado
 *
 * /api/devices/register:
 *   post:
 *     summary: Registra un nuevo dispositivo
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del dispositivo
 *     responses:
 *       201:
 *         description: Dispositivo registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Datos inválidos
 *
 * /api/devices/{id}/status:
 *   put:
 *     summary: Actualiza el estado de un dispositivo
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Nuevo estado del dispositivo
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Dispositivo no encontrado
 */

module.exports = router; 