import Record from '../models/recordModel.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const records = await Record.findAll({});
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    records.forEach(r => {
      if (r.type === 'income') {
        totalIncome += r.amount;
      } else if (r.type === 'expense') {
        totalExpense += r.amount;
      }

      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += r.amount;
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        categoryTotals,
        recentActivity: records.slice(-5).reverse()
      }
    });
  } catch(e) { next(e); }
};
