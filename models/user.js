const mongoose = require('mongoose');

// Esquema de los ingresos
const ingresoSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

// Esquema de los gastos
const gastoSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

// Esquema del usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ingresos: [ingresoSchema],  // Relación con los ingresos
  gastos: [gastoSchema]       // Relación con los gastos
});

// Modelo de Usuario basado en el esquema
const User = mongoose.model('User', userSchema);

module.exports = User;
