import { pool } from '../db';

export type ReadRequestsOptions = {
  status?: string;
  veteranId?: number;
  category?: string;
  limit?: number;
  offset?: number;
};

export const readRequests = async (opts: ReadRequestsOptions = {}) => {
  const where: string[] = [];
  const params: any[] = [];

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

  const [rows] = await pool.query(sql, params);
  return rows;
};

export const readRequestById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM service_requests WHERE id = ?;', [id]);
  return (rows as any[])[0] ?? null;
};

export const createRequest = async (data: any) => {
  const { veteranId, category, description, status } = data;

  const [result] = await pool.query(
    `INSERT INTO service_requests (veteranId, category, description, status)
     VALUES (?,?,?,?);`,
    [veteranId, category, description, status ?? 'Open']
  );

  const insertId = (result as any).insertId as number;
  return readRequestById(insertId);
};

export const updateRequest = async (id: number, data: any) => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.veteranId !== undefined) { fields.push('veteranId = ?'); params.push(data.veteranId); }
  if (data.category !== undefined) { fields.push('category = ?'); params.push(data.category); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return readRequestById(id);

  params.push(id);

  await pool.query(`UPDATE service_requests SET ${fields.join(', ')} WHERE id = ?;`, params);

  return readRequestById(id);
};

export const deleteRequest = async (id: number) => {
  const [result] = await pool.query('DELETE FROM service_requests WHERE id = ?;', [id]);
  return (result as any).affectedRows > 0;
};