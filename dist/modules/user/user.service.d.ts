import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    getMyProfile(user: any): Promise<any>;
    getPublicProfile(userId: string, user: any): Promise<any>;
    getFullProfileByAdmin(userId: string, user: any): Promise<any>;
}
