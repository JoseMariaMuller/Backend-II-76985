import TicketRepository from '../repository/TicketRepository.js';
import TicketDTO from '../dto/TicketDTO.js';

const ticketRepository = new TicketRepository();

export default class TicketController {

    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, purchaser, status } = req.query;

            const filters = {};
            if (purchaser) filters.purchaser = purchaser.toLowerCase();
            if (status) filters.status = status;

            const tickets = await ticketRepository.findAll(filters, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const ticketsDTO = tickets.docs?.map(TicketDTO.toPublic) || tickets.map(TicketDTO.toPublic);

            res.json({
                status: 'success',
                payload: ticketsDTO,
                totalPages: tickets.totalPages,
                page: tickets.page
            });
        } catch (error) {
            console.error('Error en getAll tickets:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }


    async getByCode(req, res) {
        try {
            const { code } = req.params;
            const ticket = await ticketRepository.getByCode(code);

            if (!ticket) {
                return res.status(404).json({ status: 'error', error: 'Ticket no encontrado' });
            }


            if (req.user.role !== 'admin' && ticket.purchaser !== req.user.email) {
                return res.status(403).json({ status: 'error', error: 'Acceso denegado' });
            }

            res.json({
                status: 'success',
                payload: TicketDTO.toPublic(ticket)
            });
        } catch (error) {
            console.error('Error en getByCode ticket:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }


    async getMyTickets(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;

            const tickets = await ticketRepository.findByPurchaser(req.user.email, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const ticketsDTO = tickets.docs?.map(TicketDTO.toPublic) || tickets.map(TicketDTO.toPublic);

            res.json({
                status: 'success',
                payload: ticketsDTO,
                totalPages: tickets.totalPages,
                page: tickets.page
            });
        } catch (error) {
            console.error('Error en getMyTickets:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }




    async getMyTickets(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;


            const tickets = await ticketRepository.findByPurchaser(req.user.email, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const ticketsDTO = tickets.docs?.map(TicketDTO.toPublic) || tickets.map(TicketDTO.toPublic);

            res.json({
                status: 'success',
                payload: ticketsDTO,
                totalPages: tickets.totalPages,
                page: tickets.page
            });
        } catch (error) {
            console.error('Error en getMyTickets:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }


    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, purchaser, status } = req.query;

            const filters = {};

            if (purchaser) filters.purchaser = purchaser.toLowerCase();
            if (status) filters.status = status;

            const tickets = await ticketRepository.findAll(filters, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const ticketsDTO = tickets.docs?.map(TicketDTO.toPublic) || tickets.map(TicketDTO.toPublic);

            res.json({
                status: 'success',
                payload: ticketsDTO,
                totalPages: tickets.totalPages,
                page: tickets.page
            });
        } catch (error) {
            console.error('Error en getAll tickets:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }


    async getByCode(req, res) {
        try {
            const { code } = req.params;
            const ticket = await ticketRepository.getByCode(code);

            if (!ticket) {
                return res.status(404).json({ status: 'error', error: 'Ticket no encontrado' });
            }


            if (req.user.role !== 'admin' && ticket.purchaser !== req.user.email) {
                return res.status(403).json({ status: 'error', error: 'Acceso denegado' });
            }

            res.json({
                status: 'success',
                payload: TicketDTO.toPublic(ticket)
            });
        } catch (error) {
            console.error('Error en getByCode ticket:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }
}