import { Router } from 'express';
import passport from 'passport';
import { checkAuth } from '../Middleware/checkAuth';
import { getListUser, getSessions } from '../Controllers/Users';
import { CreateEvent, DeleteEvent, ListEvent, UpdateEvent } from '../Controllers/Event';
import { createTicket, deleteTicket, listOrder, scanTicket, ticketList } from '../Controllers/Tickets';

const router = Router();

// Add passport middleware for JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

router.get('/get-session', checkAuth(), getSessions);

// users
router.post("/users/list", getListUser)

// event
router.post("/event", ListEvent)
router.post("/event/add", CreateEvent)
router.post("/event/update", UpdateEvent)
router.post("/event/delete", DeleteEvent)

// ticket
router.post("/ticket", ticketList)
router.post("/ticket/create", createTicket)
router.post("/ticket/delete", deleteTicket)
router.post("/ticket/qr-scan", scanTicket)

// order
router.post("/order", listOrder)

export default router;