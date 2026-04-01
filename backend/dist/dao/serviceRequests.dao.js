"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.createRequest = exports.readRequestById = exports.readRequests = void 0;
const db_1 = require("../db");
const readRequests = async (opts = {}) => {
    const where = [];
    const params = [];
    if (opts.status) {
        where.push('status = ?');
        params.push(opts.status);
    }
    if (opts.veteranId !== undefined) {
        where.push('veteranId = ?');
        params.push(opts.veteranId);
    }
    if (opts.category) {
        where.push('category LIKE ?');
        params.push(`%${opts.category}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limit = Math.min(opts.limit ?? 25, 100);
    const offset = Math.max(opts.offset ?? 0, 0);
    const sql = `
    SELECT *
    FROM service_requests
    ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?;
  `;
    params.push(limit, offset);
    const [rows] = await db_1.pool.query(sql, params);
    return rows;
};
exports.readRequests = readRequests;
const readRequestById = async (id) => {
    const [rows] = await db_1.pool.query('SELECT * FROM service_requests WHERE id = ?;', [id]);
    return rows[0] ?? null;
};
exports.readRequestById = readRequestById;
const createRequest = async (data) => {
    const { veteranId, category, description, status } = data;
    const [result] = await db_1.pool.query(`INSERT INTO service_requests (veteranId, category, description, status)
     VALUES (?,?,?,?);`, [veteranId, category, description, status ?? 'Open']);
    const insertId = result.insertId;
    return (0, exports.readRequestById)(insertId);
};
exports.createRequest = createRequest;
const updateRequest = async (id, data) => {
    const fields = [];
    const params = [];
    if (data.veteranId !== undefined) {
        fields.push('veteranId = ?');
        params.push(data.veteranId);
    }
    if (data.category !== undefined) {
        fields.push('category = ?');
        params.push(data.category);
    }
    if (data.description !== undefined) {
        fields.push('description = ?');
        params.push(data.description);
    }
    if (data.status !== undefined) {
        fields.push('status = ?');
        params.push(data.status);
    }
    if (fields.length === 0)
        return (0, exports.readRequestById)(id);
    params.push(id);
    await db_1.pool.query(`UPDATE service_requests SET ${fields.join(', ')} WHERE id = ?;`, params);
    return (0, exports.readRequestById)(id);
};
exports.updateRequest = updateRequest;
const deleteRequest = async (id) => {
    const [result] = await db_1.pool.query('DELETE FROM service_requests WHERE id = ?;', [id]);
    return result.affectedRows > 0;
};
exports.deleteRequest = deleteRequest;
