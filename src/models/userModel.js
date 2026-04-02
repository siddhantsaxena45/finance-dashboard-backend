import { setupDB } from './db.js';

const User = {
  findAll: async () => {
    const db = await setupDB();
    return db.all('SELECT * FROM users WHERE isDeleted = 0');
  },
  findById: async (id) => {
    const db = await setupDB();
    return db.get('SELECT * FROM users WHERE id = ? AND isDeleted = 0', [id]);
  },
  findByUsername: async (username) => {
    const db = await setupDB();
    return db.get('SELECT * FROM users WHERE username = ? AND isDeleted = 0', [username]);
  },
  create: async (userData) => {
    const db = await setupDB();
    const result = await db.run(
      'INSERT INTO users (username, role, status) VALUES (?, ?, ?)',
      [userData.username, userData.role || 'Viewer', userData.status || 'active']
    );
    return { id: result.lastID, ...userData, role: userData.role || 'Viewer', status: userData.status || 'active' };
  },
  update: async (id, updateData) => {
    const db = await setupDB();
    await db.run(
      'UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?',
      [updateData.role, updateData.status, id]
    );
    return db.get('SELECT * FROM users WHERE id = ? AND isDeleted = 0', [id]);
  },
  delete: async (id) => {
    const db = await setupDB();
    const result = await db.run('UPDATE users SET isDeleted = 1 WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

export default User;
