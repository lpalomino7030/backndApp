const pool = require('../config/db');

const createTicket = async (ticket, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const codigo = `TK-${Date.now()}`;

    const [result] = await connection.query(
      `INSERT INTO ticket 
       (codigo, titulo, descripcion, id_usuario_creador, id_estado, prioridad)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [codigo, ticket.titulo, ticket.descripcion, userId, ticket.prioridad]
    );

    const ticketId = result.insertId;

    await connection.query(
      `INSERT INTO historial_ticket
       (id_ticket, id_usuario, id_estado, comentario)
       VALUES (?, ?, 1, 'Ticket creado')`,
      [ticketId, userId]
    );

    await connection.commit();
    return ticketId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { createTicket };