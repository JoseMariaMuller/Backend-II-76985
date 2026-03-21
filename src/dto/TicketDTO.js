export default class TicketDTO {
    static toPublic(ticket) {
        if (!ticket) return null;
        
        const ticketObj = typeof ticket.toObject === 'function' 
            ? ticket.toObject() 
            : ticket;

        return {
            code: ticketObj.code,
            purchase_datetime: ticketObj.purchase_datetime,
            amount: ticketObj.amount,
            purchaser: ticketObj.purchaser,
            status: ticketObj.status,
            products: ticketObj.products?.map(p => ({
                product: p.product,
                quantity: p.quantity,
                price: p.price,
                subtotal: p.subtotal
            })) || [],
            
        };
    }
}