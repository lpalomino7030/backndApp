const pool = require("../config/db");

const createTicket = async (ticket, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const codigo = `TK-${Date.now()}`;

    const [result] = await connection.query(
      `INSERT INTO ticket 
       (codigo, titulo, descripcion, id_usuario_creador, id_estado, prioridad)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [codigo, ticket.titulo, ticket.descripcion, userId, ticket.prioridad],
    );

    const ticketId = result.insertId;

    await connection.query(
      `INSERT INTO historial_ticket
       (id_ticket, id_usuario, id_estado, comentario)
       VALUES (?, ?, 1, 'Ticket creado')`,
      [ticketId, userId],
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

const getTickets = async () => {
  let query = `SELECT tk.id_ticket, tk.codigo, tk.titulo, tk.descripcion, tk.id_usuario_creador,tk.id_usuario_asignado, st.nombre as estado, tk.prioridad, tk.fecha_creacion FROM ticket tk INNER JOIN estado_ticket st ON tk.id_estado = st.id_estado;`;

  const params = [];

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, params);
    return rows;
  } finally {
    connection.release();
  }
};

const getTicketById = async (ticketId) => {
  let query = `SELECT tk.id_ticket, tk.codigo, tk.titulo, tk.descripcion, tk.id_usuario_creador,tk.id_usuario_asignado, st.nombre as estado, tk.prioridad, tk.fecha_creacion FROM ticket tk INNER JOIN estado_ticket st ON tk.id_estado = st.id_estado
                WHERE tk.id_ticket = ?;`;
  const params = [ticketId];

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, params);
    return rows[0];
  } finally {
    connection.release();
  }
};

const updateTicket = async (ticketId, ticket) => {
  const query = `
    UPDATE ticket 
    SET titulo = ?, descripcion = ?, id_usuario_asignado = ?, prioridad = ?
    WHERE id_ticket = ?
  `;

  const params = [
    ticket.titulo,
    ticket.descripcion,
    ticket.id_usuario_asignado,
    ticket.prioridad,
    ticketId,
  ];

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(query, params);

    await connection.commit();

    return result.affectedRows;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deleteTicket = async (ticketId) => {
  let query = `DELETE FROM ticket WHERE id_ticket = ?`;
  const params = [ticketId];
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(query, params);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getTicketEstados = async () => {
  let query = `SELECT id_estado, nombre FROM estado_ticket;`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } finally {
    connection.release();
  }
}



module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketEstados
};
