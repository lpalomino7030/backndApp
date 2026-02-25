const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { nombres, apellidos, email, password, id_rol } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const userId = await userModel.createUser({
      nombres,
      apellidos,
      email,
      password_hash: hash,
      id_rol
    });

    res.status(201).json({ message: 'Usuario creado', userId });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};

module.exports = { register, login };