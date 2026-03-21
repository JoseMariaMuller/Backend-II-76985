import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { 
        type: String, 
        unique: true, 
        required: true,
        default: () => `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    purchase_datetime: { 
        type: Date, 
        default: Date.now 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    purchaser: { 
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        price: { 
            type: Number, 
            required: true 
        },
        subtotal: { 
            type: Number, 
            required: true 
        }
    }],
    status: {
        type: String,
        enum: ['completed', 'partial', 'failed', 'refunded'],
        default: 'completed'
    },
    failed_products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        reason: String
    }]
}, {
    timestamps: true
});

export const TicketModel = mongoose.model('Ticket', ticketSchema);