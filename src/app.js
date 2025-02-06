const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const devicesRoutes = require('./routes/devices.routes');
const uploadRoutes = require('./routes/upload.routes'); // Importa la nueva ruta

const errorHandler = require('./middleware/error');
const apiLimiter = require('./middleware/rateLimiter');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch(e) {
      res.status(400).json({ message: 'Invalid JSON' });
    }
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

app.use('/api/', apiLimiter);

app.use('/api-docs', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
    explorer: true
  })
);

// **Agregar la nueva ruta de subida de imágenes**
app.use('/api/upload', uploadRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/devices', devicesRoutes);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Conectado a MongoDB');
    
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
