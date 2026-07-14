export declare class ScheduleEntryDto {
    date: string;
    start_time: string;
    end_time: string;
}
export declare class CreateScheduleRequestDto {
    week_start: string;
    entries: ScheduleEntryDto[];
}
