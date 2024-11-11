export interface UsageParams {
    pageNum : Number;
    officeName : string | null;
    useDate : Date | null;
    userName : string | null;
    userDepartment : string | null;
    usageTime : string | null;
    usageType : boolean | null;
}

export interface ticketUsage {
    page_num : Number;
    office_name : string;
    used_date : string;
    user_name : string;
    user_department : string;
    usage_time : string;
    usage_type : boolean;
    total_count : number;
}

export interface TransferTickets {
    date : Date;
    company : string;
    office : string;
    quantity : number;
    ticketType : boolean;
}

export interface PaggingTicketIssu {
    pageNum : number;
    officeName : string
}

export interface TicketIssuList {
    issu_id: number;
    issu_date: string;
    issu_company_name: string;
    issu_quantity: number;
    issu_type: boolean;
    total_count: number;
}