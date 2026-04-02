import Record from '../models/recordModel.js';

export const getAllRecords = async (req, res, next) => {
  try {
    const { type, category, date, search, page, limit } = req.query;
    const filters = {};
    
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (date) filters.date = date;
    
    if (search) filters.search = search;

    if (limit) {
      filters.limit = parseInt(limit, 10);
      const pageNum = page ? parseInt(page, 10) : 1;
      filters.offset = (pageNum - 1) * filters.limit;
    }

    const records = await Record.findAll(filters);
    
    const responsePayload = { records };
    if (limit) {
      responsePayload.page = parseInt(page, 10) || 1;
      responsePayload.limit = filters.limit;
    }

    res.json(responsePayload);
  } catch(e) { next(e); }
};

export const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    if (!amount || !type || !category) {
      return res.status(400).json({ error: "Amount, type, and category are required." });
    }

    const record = await Record.create({ amount, type, category, date, notes, userId: req.user.id });
    res.status(201).json({ message: "Record created successfully", record });
  } catch(e) { next(e); }
};

export const updateRecord = async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id, 10);
    const existing = await Record.findById(recordId);
    if (!existing) {
      return res.status(404).json({ error: "Record not found." });
    }

    const updatedRecord = await Record.update(recordId, req.body);
    res.json({ message: "Record updated successfully", record: updatedRecord });
  } catch(e) { next(e); }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id, 10);
    const success = await Record.delete(recordId);
    
    if (!success) {
      return res.status(404).json({ error: "Record not found." });
    }

    res.json({ message: "Record deleted successfully" });
  } catch(e) { next(e); }
};
