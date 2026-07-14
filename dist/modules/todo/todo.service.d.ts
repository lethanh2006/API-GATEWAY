import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class TodoService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    getMyTasks(user: any): Promise<any>;
    updateTaskStatus(id: string, status: string, user: any): Promise<any>;
    createTask(dto: any, user: any): Promise<any>;
    assignTask(id: string, assignedTo: string, user: any): Promise<any>;
    getAllTasks(user: any): Promise<any>;
    deleteTask(id: string, user: any): Promise<any>;
}
