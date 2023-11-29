import express from 'express';
import TicketModel from '../models/ticket.models.js';
import ticketService from '../services/ticketService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const latestTicket = await TicketModel.findOne().sort({ purchase_datetime: -1 });

    if (!latestTicket) {
      return res.status(404).json({ message: 'No se encontró ningún ticket.' });
    }

    const userEmail = latestTicket.purchaser;
    await ticketService.generateTicket(latestTicket.toObject(), userEmail);

    res.render('ticket-sent',{layout: false});
  } catch (error) {
    console.error('Error al obtener el último ticket o enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
