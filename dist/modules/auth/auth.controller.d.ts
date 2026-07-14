import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<any>;
    login(body: any): Promise<any>;
    verifyOtp(body: any): Promise<any>;
    refresh(body: any): Promise<any>;
    loginWithGoogle(body: any): Promise<any>;
    getMyProfile(req: any): Promise<any>;
    updateMyEmail(body: any, req: any): Promise<any>;
    deleteMyAccount(req: any): Promise<any>;
    getUserProfileByAdmin(userId: string, req: any): Promise<any>;
    deleteUserByAdmin(userId: string, req: any): Promise<any>;
}
