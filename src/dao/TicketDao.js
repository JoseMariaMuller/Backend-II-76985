import BaseDao from './BaseDao.js';
import { TicketModel } from '../models/ticket.model.js';

export default class TicketDao extends BaseDao {
    constructor() {
        super(TicketModel);
    }

    async findByPurchaser(email) {
        return await this.model.find({ purchaser: email.toLowerCase() }).lean();
    }

    async findByCode(code) {
        return await this.model.findOne({ code }).lean();
    }

    async getStatsByDateRange(startDate, endDate) {
        const match = {};
        if (startDate || endDate) {
            match.purchase_datetime = {};
            if (startDate) match.purchase_datetime.$gte = new Date(startDate);
            if (endDate) match.purchase_datetime.$lte = new Date(endDate);
        }

        return await this.model.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchase_datetime' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
    }
}