import { ScheduleEntryDto } from './create-request.dto';
export declare class UpdateScheduleEntriesDto {
    entries: ScheduleEntryDto[];
}
export declare class UpdatePolicyDto {
    registration_start?: string;
    registration_end?: string;
    locked?: boolean;
}
export declare class ScanAttendanceDto {
    token: string;
}
export declare class RejectRequestDto {
    reason: string;
}
export declare class BulkApproveDto {
    ids: string[];
}
