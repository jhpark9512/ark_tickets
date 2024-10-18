import { Router } from 'express';
import * as api from '../utilities/api'

const router = Router();

router.get('/tickets', api.getTickets);  
router.get('/office_ticket_list', api.getOfficeTicketList);
router.get('/office_ticket_amount',api.getOfficeTicketAmount)
router.get('/purchase/paging', api.purchasePaging)
router.get('/paging_usage',api.getOfficeUsageList)
router.post('/insert_purchase_history',api.insertPurchaseHistory)
router.post('/cancel_purchase',api.cancelPurchaseHistory)
router.post('/transfer_tickets', api.transferTickets)
router.post('/pagging_ticket_issu', api.paggingTicketIssu)
export default router;