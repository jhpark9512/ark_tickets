export interface OfficeTicketAmount {
    ot_amount_id: number;
    ot_office_name: string;
    ot_ticket_quantity: number;
}

export interface PurchaseData {
    p_purchase_id: number;
    p_purchase_date: Date;
    p_purchase_ticket_id: string;
    p_purchase_quantity: number;
    p_purchase_type: boolean;
}

