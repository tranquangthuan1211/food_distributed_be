const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String },
  street: { type: String },
  city: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  addresses: { type: [addressSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
