import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    register(dto: any): Promise<any>;
    login(dto: any): Promise<any>;
    verifyOtp(dto: any): Promise<any>;
    refresh(dto: any): Promise<any>;
    loginWithGoogle(dto: any): Promise<any>;
    getMyProfile(user: any): Promise<any>;
    updateMyEmail(dto: any, user: any): Promise<any>;
    deleteMyAccount(user: any): Promise<any>;
    getUserProfileByAdmin(userId: string, user: any): Promise<any>;
    deleteUserByAdmin(userId: string, user: any): Promise<any>;
}
