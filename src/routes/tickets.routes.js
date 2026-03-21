import { Router } from 'express';
import TicketController from '../controllers/TicketController.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { isAdmin, isUser } from '../middleware/role.middleware.js';

const router = Router();
const ticketController = new TicketController();

// ADMIN: Ver todos los tickets 
router.get('/', 
    authenticateJWT, 
    isAdmin, 
    async (req, res) => {
        await ticketController.getAll(req, res);
    }
);

// USER: Ver mis tickets 
router.get('/my-tickets', 
    authenticateJWT, 
    isUser, 
    async (req, res) => {
        await ticketController.getMyTickets(req, res);
    }
);

//  USER/ADMIN: Ver ticket por código específico
router.get('/:code', 
    authenticateJWT, 
    async (req, res) => {
        await ticketController.getByCode(req, res);
    }
);

export default router;