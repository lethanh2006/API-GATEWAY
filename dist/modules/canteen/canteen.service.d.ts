import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class CanteenService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    getMenu(): Promise<any>;
    createMenuItem(dto: any, user: any): Promise<any>;
    updateMenuItem(id: string, dto: any, user: any): Promise<any>;
    deleteMenuItem(id: string, user: any): Promise<any>;
    undoMenuItemChange(user: any): Promise<any>;
    redoMenuItemChange(user: any): Promise<any>;
}
