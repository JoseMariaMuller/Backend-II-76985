import TicketDao from '../dao/TicketDao.js';

export default class TicketRepository {
    constructor() {
        this.dao = new TicketDao();
    }

    async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);
    
    const total = await this.dao.model.countDocuments(filters);
    const totalPages = Math.ceil(total / limitNum);
    
    const docs = await this.dao.model
        .find(filters)
        .sort({ purchase_datetime: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();
    
    return {
        docs,
        page: parseInt(page),
        totalPages,
        totalDocs: total,
        limit: limitNum,
        hasPrevPage: parseInt(page) > 1,
        hasNextPage: parseInt(page) < totalPages,
        prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
        nextPage: parseInt(page) < totalPages ? parseInt(page) + 1 : null
    };
    }

    async getById(id) {
        return await this.dao.findById(id);
    }
    async getByCode(code) {
        return await this.dao.model.findOne({ code }).lean();
    }

async findByPurchaser(email, options = {}) {
    const { page = 1, limit = 10 } = options;
    
    const query = { purchaser: email.toLowerCase() };
   
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);
    
    const total = await this.dao.model.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
  
    const docs = await this.dao.model
        .find(query)
        .sort({ purchase_datetime: -1 })  
        .skip(skip)
        .limit(limitNum)
        .lean();  
    
    
    return {
        docs,
        page: parseInt(page),
        totalPages,
        totalDocs: total,
        limit: limitNum,
        hasPrevPage: parseInt(page) > 1,
        hasNextPage: parseInt(page) < totalPages,
        prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
        nextPage: parseInt(page) < totalPages ? parseInt(page) + 1 : null
    };
}

    
    async create(ticketData) {
        
        if (!ticketData.purchaser || !ticketData.amount) {
            throw new Error('Purchaser y amount son requeridos');
        }
        
        if (ticketData.amount < 0) {
            throw new Error('El monto no puede ser negativo');
        }

        
        const data = {
            ...ticketData,
            code: ticketData.code || this._generateTicketCode(),
            purchase_datetime: new Date(),
            status: ticketData.status || 'completed'
        };

        return await this.dao.create(data);
    }

   
    async updateStatus(ticketId, newStatus) {
        const validStatuses = ['completed', 'partial', 'failed', 'refunded'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Estado inválido. Opciones: ${validStatuses.join(', ')}`);
        }

        return await this.dao.updateById(ticketId, {
            status: newStatus,
            updatedAt: new Date()
        });
    }

    _generateTicketCode() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `TICKET-${timestamp}-${random}`;
    }

   
    async getStats(startDate, endDate) {
        const match = {};
        if (startDate || endDate) {
            match.purchase_datetime = {};
            if (startDate) match.purchase_datetime.$gte = new Date(startDate);
            if (endDate) match.purchase_datetime.$lte = new Date(endDate);
        }

        return await this.dao.model.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalTickets: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    completed: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
                    },
                    partial: { 
                        $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] } 
                    },
                    failed: { 
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } 
                    }
                }
            }
        ]);
    }
}