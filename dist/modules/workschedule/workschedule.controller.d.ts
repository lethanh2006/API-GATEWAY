import { WorkscheduleService } from './workschedule.service';
import { CreateScheduleRequestDto } from './dto/create-request.dto';
import { UpdateScheduleEntriesDto, UpdatePolicyDto, ScanAttendanceDto, RejectRequestDto, BulkApproveDto } from './dto/update-entries.dto';
export declare class WorkscheduleController {
    private readonly workscheduleService;
    constructor(workscheduleService: WorkscheduleService);
    getPendingRequests(req: any): Promise<any>;
    getAllRequests(req: any): Promise<any>;
    approveRequest(id: string, req: any): Promise<any>;
    rejectRequest(id: string, body: RejectRequestDto, req: any): Promise<any>;
    bulkApprove(body: BulkApproveDto, req: any): Promise<any>;
    getHeatmap(req: any): Promise<any>;
    scanAttendance(body: ScanAttendanceDto, req: any): Promise<any>;
    getMyAttendance(req: any): Promise<any>;
    generateQrToken(req: any): Promise<any>;
    getTodayAttendance(req: any): Promise<any>;
    getReport(req: any): Promise<any>;
    getPolicy(): Promise<any>;
    updatePolicy(body: UpdatePolicyDto, req: any): Promise<any>;
    getMySchedules(req: any): Promise<any>;
    createRequest(body: CreateScheduleRequestDto, req: any): Promise<any>;
    getRequestInfo(id: string, req: any): Promise<any>;
    updateEntries(id: string, body: UpdateScheduleEntriesDto, req: any): Promise<any>;
    submitRequest(id: string, req: any): Promise<any>;
    deleteRequest(id: string, req: any): Promise<any>;
}
