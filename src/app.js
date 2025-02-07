const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const devicesRoutes = require('./routes/devices.routes');
const uploadRoutes = require('./routes/upload.routes'); 

const errorHandler = require('./middleware/error');
const apiLimiter = require('./middleware/rateLimiter');
const swaggerSpec = require('./config/swagger');

const app = express();

//Configuración de CORS para permitir solicitudes desde Vercel en producción
const allowedOrigins = [
  'https://demo-aplic.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//Middleware para manejar JSON y errores en JSON
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ message: 'Invalid JSON' });
    }
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores global
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

// 🔹 Límite de solicitudes para evitar abuso
app.use('/api/', apiLimiter);

// Configuración de Swagger (Documentación de API)
app.use('/api-docs', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
  explorer: true
}));

// 🔹 Rutas de la API
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/devices', devicesRoutes);

// Ruta para verificar estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Redirigir a la documentación en la raíz
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Conectado a MongoDB');
    
    // Iniciar el servidor en cualquier entorno
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  })
  .catch(err => {
    console.error(' Error de conexión a MongoDB:', err.message);
  });

// Intento de reconexión en caso de fallo
mongoose.connection.on('error', err => {
  console.error('Error de MongoDB:', err.message);
});

mongoose.connection.on('disconnected', async () => {
  console.warn('Desconectado de MongoDB. Intentando reconectar...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Reconexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error en la reconexión:', error);
  }
});

module.exports = app;
