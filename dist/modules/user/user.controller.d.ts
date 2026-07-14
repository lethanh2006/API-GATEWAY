import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMyProfile(req: any): Promise<any>;
    getAllUsers(req: any): Promise<any>;
    getPublicProfile(userId: string, req: any): Promise<any>;
    updateUser(body: UpdateUserDto, req: any): Promise<any>;
    getFullProfileByAdmin(userId: string, req: any): Promise<any>;
}
