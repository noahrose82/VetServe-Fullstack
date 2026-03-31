import { pool } from '../db';

export type Veteran = {
  id: number;
  firstName: string;
  lastName: string;
  branch: 'Navy' | 'Army' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force';
  email: string;
  createdAt: string;
};

export const readVeterans = async () => {
  const [rows] = await pool.query('SELECT * FROM veterans ORDER BY id DESC;');
  return rows;
};

export const readVeteranById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM veterans WHERE id = ?;', [id]);
  return (rows as any[])[0] ?? null;
};

export const createVeteran = async (data: Omit<Veteran, 'id' | 'createdAt'>) => {
  const { firstName, lastName, branch, email } = data;
  const [result] = await pool.query(
    'INSERT INTO veterans (firstName, lastName, branch, email) VALUES (?,?,?,?);',
    [firstName, lastName, branch, email]
  );
  const insertId = (result as any).insertId as number;
  return readVeteranById(insertId);
};

export const updateVeteran = async (
  id: number,
  data: Partial<Omit<Veteran, 'id' | 'createdAt'>>
) => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.firstName !== undefined) { fields.push('firstName = ?'); params.push(data.firstName); }
  if (data.lastName !== undefined) { fields.push('lastName = ?'); params.push(data.lastName); }
  if (data.branch !== undefined) { fields.push('branch = ?'); params.push(data.branch); }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }

  if (fields.length === 0) return readVeteranById(id);

  params.push(id);
  await pool.query(`UPDATE veterans SET ${fields.join(', ')} WHERE id = ?;`, params);

  return readVeteranById(id);
};

export const deleteVeteran = async (id: number) => {
  const [result] = await pool.query('DELETE FROM veterans WHERE id = ?;', [id]);
  return (result as any).affectedRows > 0;
};