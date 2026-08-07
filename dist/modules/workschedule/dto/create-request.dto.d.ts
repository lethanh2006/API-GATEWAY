import { WorkPeriod } from './work-request.dto';
export declare enum ScheduleEntryType {
    OFFICE = "office",
    REMOTE = "remote",
    DAY_OFF = "day_off",
    LEAVE = "leave"
}
export declare class ScheduleEntryDto {
    date: string;
    type: ScheduleEntryType;
    period: WorkPeriod;
    note?: string;
}
export declare class CreateScheduleRequestDto {
    week_start: string;
    entries: ScheduleEntryDto[];
}
