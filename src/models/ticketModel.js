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
// (userId, userRole)
const getTickets = async () => {
  // let query = `SELECT t.*, u.nombres AS creador, e.nombre AS estado
  //               FROM ticket t
  //               JOIN usuario u ON t.id_usuario_creador = u.id
  //               JOIN estado e ON t.id_estado = e.id`;
  
  let query = `SELECT tk.id_ticket, tk.codigo, tk.titulo, tk.descripcion, tk.id_usuario_creador,tk.id_usuario_asignado, st.nombre as estado, tk.prioridad, tk.fecha_creacion FROM ticket tk INNER JOIN estado_ticket st ON tk.id_estado = st.id_estado;`;
  
                const params = [];

  // if (userRole === "Usuario") {
  //   query += ` WHERE t.id_usuario_creador = ?`;
  //   params.push(userId);
  // }
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

  // if (userRole === "Usuario") {
  //   query += ` AND t.id_usuario_creador = ?`;
  //   params.push(userId);
  // }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, params);
    return rows[0];
  } finally {
    connection.release();
  }
};

const updateTicket = async (ticketId, ticket, userId, userRole) => {
  let query = `UPDATE ticket SET titulo = ?, descripcion = ?, prioridad = ? WHERE id = ?`;
  const params = [
    ticket.titulo,
    ticket.descripcion,
    ticket.prioridad,
    ticketId,
  ];
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

const deleteTicket = async (ticketId, userId, userRole) => {
  let query = `DELETE FROM ticket WHERE id = ?`;
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

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
