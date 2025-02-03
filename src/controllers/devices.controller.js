const Device = require('../models/device.model');

const deviceController = {
  async register(req, res) {
    try {
      // Validar tipo de dispositivo antes de crear
      if (!['sensor', 'actuator', 'gateway'].includes(req.body.type)) {
        return res.status(400).json({
          message: 'Tipo de dispositivo no válido'
        });
      }

      // Verificar si el dispositivo ya existe
      const existingDevice = await Device.findOne({ 
        serialNumber: req.body.serialNumber 
      });

      if (existingDevice) {
        return res.status(400).json({ 
          message: 'El dispositivo ya está registrado' 
        });
      }

      const device = new Device({
        ...req.body,
        owner: req.user.uid,
        status: 'active',
        lastConnection: new Date()
      });

      await device.save();
      res.status(201).json(device);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { status, type } = req.query;
      const query = { owner: req.user.uid };

      if (status) {
        query.status = status;
      }

      if (type) {
        query.type = type;
      }

      const devices = await Device.find(query)
        .sort({ lastConnection: -1 });

      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const device = await Device.findOne({
        _id: req.params.id,
        owner: req.user.uid
      });

      if (!device) {
        return res.status(404).json({ 
          message: 'Dispositivo no encontrado' 
        });
      }

      res.json(device);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { status, metadata } = req.body;
      const device = await Device.findOneAndUpdate(
        { 
          _id: req.params.id,
          owner: req.user.uid
        },
        { 
          status,
          metadata,
          lastConnection: new Date()
        },
        { new: true }
      );

      if (!device) {
        return res.status(404).json({ 
          message: 'Dispositivo no encontrado' 
        });
      }

      res.json(device);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const device = await Device.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.uid
      });

      if (!device) {
        return res.status(404).json({ 
          message: 'Dispositivo no encontrado' 
        });
      }

      res.json({ message: 'Dispositivo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = deviceController; 