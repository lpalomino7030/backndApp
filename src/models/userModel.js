const pool = require('../config/db');

const createUser = async (user) => {
  const { nombres, apellidos, email, password_hash, id_rol } = user;

  const [result] = await pool.query(
    `INSERT INTO usuario 
     (nombres, apellidos, email, password_hash, id_rol) 
     VALUES (?, ?, ?, ?, ?)`,
    [nombres, apellidos, email, password_hash, id_rol]
  );

  return result.insertId;
};

const findUsers = async () =>{
  const [rows] = await pool.query(
    `SELECT id_usuario, nombres FROM usuario`
  )

  return rows;
}

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM usuario WHERE email = ?`,
    [email]
  );
  return rows[0];
};

module.exports = { createUser, findByEmail,findUsers };