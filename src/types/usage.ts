export interface UserUsageData {
    u_usaage_id: number;
    u_usage_user_id: string;
    u_usage_used_date: string;
    u_usage_ticket_id: string;
    u_usage_used_time: string;
    u_usage_type: boolean;
}

export interface Event {
    type: string;
    content: string;
}