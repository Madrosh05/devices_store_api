const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'inactive'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastConnection: Date,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema); 