import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMyProfile(req: any): Promise<any>;
    getPublicProfile(userId: string, req: any): Promise<any>;
    getFullProfileByAdmin(userId: string, req: any): Promise<any>;
}
