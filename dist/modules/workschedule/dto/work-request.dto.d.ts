export declare enum WorkRequestType {
    LEAVE = "leave",
    LATE = "late",
    EARLY = "early",
    OVERTIME = "overtime",
    BUSINESS_TRIP = "business_trip",
    REMOTE = "remote"
}
export declare enum WorkPeriod {
    FULL_DAY = "full_day",
    MORNING = "morning",
    AFTERNOON = "afternoon"
}
export declare class CreateWorkRequestDto {
    type: WorkRequestType;
    start_at: string;
    end_at?: string;
    period: WorkPeriod;
    reason: string;
    location?: string;
    project?: string;
    estimated_cost?: number;
    manager_id?: string;
    attachment_urls?: string[];
    is_school_leave?: boolean;
}
