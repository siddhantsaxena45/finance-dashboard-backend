import { setupDB } from './db.js';

const Record = {
  findAll: async (filters) => {
    const db = await setupDB();
    let query = 'SELECT * FROM records WHERE isDeleted = 0';
    const params = [];
    
    if (filters) {
      if (filters.type) { query += ' AND type = ?'; params.push(filters.type); }
      if (filters.category) { query += ' AND category = ?'; params.push(filters.category); }
      if (filters.date) { query += ' AND date = ?'; params.push(filters.date); }
      
      if (filters.search) {
        query += ' AND (notes LIKE ? OR category LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        if (filters.offset !== undefined) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
    }
    
    return db.all(query, params);
  },
  findById: async (id) => {
    const db = await setupDB();
    return db.get('SELECT * FROM records WHERE id = ? AND isDeleted = 0', [id]);
  },
  create: async (recordData) => {
    const db = await setupDB();
    const date = recordData.date || new Date().toISOString().split('T')[0];
    const result = await db.run(
      'INSERT INTO records (amount, type, category, date, notes, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [recordData.amount, recordData.type, recordData.category, date, recordData.notes || '', recordData.userId]
    );
    return { id: result.lastID, ...recordData, date };
  },
  update: async (id, updateData) => {
    const db = await setupDB();
    await db.run(
      'UPDATE records SET amount = coalesce(?, amount), type = coalesce(?, type), category = coalesce(?, category), date = coalesce(?, date), notes = coalesce(?, notes) WHERE id = ?',
      [updateData.amount, updateData.type, updateData.category, updateData.date, updateData.notes, id]
    );
    return db.get('SELECT * FROM records WHERE id = ? AND isDeleted = 0', [id]);
  },
  delete: async (id) => {
    const db = await setupDB();
    const result = await db.run('UPDATE records SET isDeleted = 1 WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

export default Record;
