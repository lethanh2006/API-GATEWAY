import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateEmailDto, LoginGoogleDto } from './dto/update-email.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<any>;
    login(body: LoginDto): Promise<any>;
    verifyOtp(body: VerifyOtpDto): Promise<any>;
    refresh(body: any): Promise<any>;
    loginWithGoogle(body: LoginGoogleDto): Promise<any>;
    getMyProfile(req: any): Promise<any>;
    updateMyEmail(body: UpdateEmailDto, req: any): Promise<any>;
    deleteMyAccount(req: any): Promise<any>;
    getUserProfileByAdmin(userId: string, req: any): Promise<any>;
    deleteUserByAdmin(userId: string, req: any): Promise<any>;
    updateUserRole(userId: string, body: {
        role: string;
    }): Promise<any>;
}
