const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear una instancia de Express
const app = express();
app.use(cors());

// Middleware para recibir JSON en el cuerpo de las solicitudes
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mipresupuesto', { 
  
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error de conexión', error));

// Definir el modelo User
const User = require('./models/User');

// Ruta para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Ruta para crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, ingresos = [], gastos = [] } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const newUser = new User({ username, password, ingresos, gastos });
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para eliminar un usuario por su ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para actualizar un usuario por su ID
// Ruta para actualizar un usuario por su ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { username, password, ingresos, gastos } = req.body;

    // Crear un objeto de actualización solo con los campos proporcionados
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (ingresos) updateData.ingresos = ingresos;
    if (gastos) updateData.gastos = gastos;

    // Validar que se están enviando datos a actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});





// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
