import { CanteenService } from './canteen.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
export declare class CanteenController {
    private readonly canteenService;
    constructor(canteenService: CanteenService);
    getMenu(): Promise<any>;
    createMenuItem(body: CreateMenuItemDto, req: any): Promise<any>;
}
