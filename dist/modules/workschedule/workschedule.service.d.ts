import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class WorkscheduleService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    getPendingRequests(user: any): Promise<any>;
    getAllRequests(user: any): Promise<any>;
    approveRequest(id: string, user: any): Promise<any>;
    rejectRequest(id: string, user: any): Promise<any>;
    bulkApprove(dto: any, user: any): Promise<any>;
    getHeatmap(user: any): Promise<any>;
    scanAttendance(dto: any, user: any): Promise<any>;
    getMyAttendance(user: any): Promise<any>;
    generateQrToken(user: any): Promise<any>;
    getTodayAttendance(user: any): Promise<any>;
    getReport(user: any): Promise<any>;
    getPolicy(): Promise<any>;
    updatePolicy(dto: any, user: any): Promise<any>;
    getMySchedules(user: any): Promise<any>;
    createRequest(dto: any, user: any): Promise<any>;
    getRequestInfo(id: string, user: any): Promise<any>;
    updateEntries(id: string, dto: any, user: any): Promise<any>;
    submitRequest(id: string, user: any): Promise<any>;
    deleteRequest(id: string, user: any): Promise<any>;
}
