const pool = require('../config/db');
const userModel = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT u.id_usuario,u.nombres,u.apellidos,u.email,u.id_rol,r.nombre AS rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol WHERE u.id_usuario = ?",
      [req.user.id]
    );

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

const getUsers = async (req, res) => {
  try {
    const usersActive = await userModel.findUsers();
    res.json(usersActive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
 }

module.exports = { getProfile, getUsers };