const pool = require('../config/db');

const createRol = async (rolData) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO rol (name) VALUES (?)', [rolData.name]);
        return result.insertId;
    } catch (error) {
        throw error;
    } finally {       connection.release();
    }   
};


const getRoles = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM rol');
        return rows;
    } catch (error) {
        throw error;
    } finally {       connection.release();
    }
}

module.exports = { getRoles, createRol };