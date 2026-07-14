import { WorkscheduleService } from './workschedule.service';
export declare class WorkscheduleController {
    private readonly workscheduleService;
    constructor(workscheduleService: WorkscheduleService);
    getPendingRequests(req: any): Promise<any>;
    getAllRequests(req: any): Promise<any>;
    approveRequest(id: string, req: any): Promise<any>;
    rejectRequest(id: string, req: any): Promise<any>;
    bulkApprove(body: any, req: any): Promise<any>;
    getHeatmap(req: any): Promise<any>;
    scanAttendance(body: any, req: any): Promise<any>;
    getMyAttendance(req: any): Promise<any>;
    generateQrToken(req: any): Promise<any>;
    getTodayAttendance(req: any): Promise<any>;
    getReport(req: any): Promise<any>;
    getPolicy(): Promise<any>;
    updatePolicy(body: any, req: any): Promise<any>;
    getMySchedules(req: any): Promise<any>;
    createRequest(body: any, req: any): Promise<any>;
    getRequestInfo(id: string, req: any): Promise<any>;
    updateEntries(id: string, body: any, req: any): Promise<any>;
    submitRequest(id: string, req: any): Promise<any>;
    deleteRequest(id: string, req: any): Promise<any>;
}
