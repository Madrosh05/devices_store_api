const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const devicesRoutes = require('./routes/devices.routes');
const errorHandler = require('./middleware/error');
const apiLimiter = require('./middleware/rateLimiter');
const swaggerSpec = require('./config/swagger');

const app = express();

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 */

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores global
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de la API y la conexión a MongoDB
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Estado actual del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API is running
 *                 mongoStatus:
 *                   type: string
 *                   example: connected
 */

// Rate Limiter
app.use('/api/', apiLimiter);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticación
 *   - name: Products
 *     description: Gestión de productos
 *   - name: Devices
 *     description: Gestión de dispositivos
 *   - name: Health
 *     description: Estado del servidor
 */

// Servir archivos estáticos de swagger-ui
app.use('/api-docs', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

// Configuración de Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Horus Automation API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
  explorer: true
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    ...swaggerOptions,
    customCssUrl: '/api-docs/swagger-ui.css',
    customJs: '/api-docs/swagger-ui-bundle.js',
    customfavIcon: '/api-docs/favicon-32x32.png'
  })
);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/devices', devicesRoutes);

// Endpoint para obtener la especificación de Swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Modificar la conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(' Conectado a MongoDB');
        
        // Solo iniciar el servidor si no estamos en Vercel
        if (process.env.NODE_ENV !== 'production') {
            const PORT = process.env.PORT || 3001;
            app.listen(PORT, () => {
                console.log(` Servidor corriendo en puerto ${PORT}`);
            });
        }
    })
    .catch(err => {
        console.error(' Error de conexión a MongoDB:', err.message);
    });

// Eventos de conexión MongoDB
mongoose.connection.on('error', err => {
  console.error(' Error de MongoDB:', err.message);
});

mongoose.connection.on('disconnected', async () => {
  console.warn(' Desconectado de MongoDB. Intentando reconectar...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Reconexión exitosa a MongoDB');
  } catch (error) {
    console.error(' Error en la reconexión:', error);
  }
});

module.exports = app; 