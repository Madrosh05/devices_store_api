const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  loginHistory: [{
    timestamp: Date,
    device: String,
    ip: String
  }],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 