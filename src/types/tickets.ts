// 관리자 메인 식권 개수
export interface OfficeTicketAmount {
    ot_amount_id: number;
    ot_office_name: string;
    ot_ticket_quantity: number;
}

export interface OfficeData {
    o_office_id: string;
    o_company_name: string;
    o_ticket_quantity: number;
}

//식권 구매 양식
export interface PurchaseData {
    p_purchase_id: number;
    p_purchase_date: string;
    p_purchase_ticket_id: string;
    p_purchase_quantity: number;
    p_purchase_type: boolean;
    total_count: number;
}

