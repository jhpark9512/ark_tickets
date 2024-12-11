import { Router } from 'express';
import * as api from '../utilities/api'

const router = Router();

router.get('/tickets', api.getTickets);  
router.get('/office_ticket_list', api.getOfficeTicketList);
router.get('/read_office_ticket_amount',api.getOfficeTicketAmount)
router.get('/purchase/paging', api.purchasePaging)
router.get('/paging_usage',api.getOfficeUsageList)
router.post('/insert_purchase_history',api.insertPurchaseHistory)
router.post('/cancel_purchase',api.cancelPurchaseHistory)
router.post('/transfer_tickets', api.transferTickets)
router.post('/paging_ticket_issu', api.pagingTicketIssu)
router.post('/recallTickets', api.recallTickets)
router.post('/login', api.login)
router.post('/user_usages', api.userUsage)
router.post('/insert_usage', api.insertUsage)
router.post('/check_usage',api.checkUsage)
router.post('/update_ticket_usages',api.updateUsage)
export default router;