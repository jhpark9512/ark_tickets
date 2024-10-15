import { Router } from 'express';
import * as api from '../utilities/api'

const router = Router();

router.get('/tickets', api.getTickets);  // GET /tickets
router.get('/office-ticket-amount', api.getOfficeTicketAmount);  // GET /office-ticket-amount
router.get('/purchase/paging', api.purchasePaging)
router.post('/insert_purchase_history',api.insertPurchaseHistory)
router.post('/cancel_purchase',api.cancelPurchaseHistory)
export default router;