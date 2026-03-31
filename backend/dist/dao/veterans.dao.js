"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVeteran = exports.updateVeteran = exports.createVeteran = exports.readVeteranById = exports.readVeterans = void 0;
const db_1 = require("../db");
const readVeterans = async () => {
    const [rows] = await db_1.pool.query('SELECT * FROM veterans ORDER BY id DESC;');
    return rows;
};
exports.readVeterans = readVeterans;
const readVeteranById = async (id) => {
    const [rows] = await db_1.pool.query('SELECT * FROM veterans WHERE id = ?;', [id]);
    return rows[0] ?? null;
};
exports.readVeteranById = readVeteranById;
const createVeteran = async (data) => {
    const { firstName, lastName, branch, email } = data;
    const [result] = await db_1.pool.query('INSERT INTO veterans (firstName, lastName, branch, email) VALUES (?,?,?,?);', [firstName, lastName, branch, email]);
    const insertId = result.insertId;
    return (0, exports.readVeteranById)(insertId);
};
exports.createVeteran = createVeteran;
const updateVeteran = async (id, data) => {
    const fields = [];
    const params = [];
    if (data.firstName !== undefined) {
        fields.push('firstName = ?');
        params.push(data.firstName);
    }
    if (data.lastName !== undefined) {
        fields.push('lastName = ?');
        params.push(data.lastName);
    }
    if (data.branch !== undefined) {
        fields.push('branch = ?');
        params.push(data.branch);
    }
    if (data.email !== undefined) {
        fields.push('email = ?');
        params.push(data.email);
    }
    if (fields.length === 0)
        return (0, exports.readVeteranById)(id);
    params.push(id);
    await db_1.pool.query(`UPDATE veterans SET ${fields.join(', ')} WHERE id = ?;`, params);
    return (0, exports.readVeteranById)(id);
};
exports.updateVeteran = updateVeteran;
const deleteVeteran = async (id) => {
    const [result] = await db_1.pool.query('DELETE FROM veterans WHERE id = ?;', [id]);
    return result.affectedRows > 0;
};
exports.deleteVeteran = deleteVeteran;
