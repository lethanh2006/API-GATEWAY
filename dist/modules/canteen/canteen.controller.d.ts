import { CanteenService } from './canteen.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class CanteenController {
    private readonly canteenService;
    constructor(canteenService: CanteenService);
    getMenu(): Promise<any>;
    createMenuItem(body: CreateMenuItemDto, req: any): Promise<any>;
    updateMenuItem(id: string, body: UpdateMenuItemDto, req: any): Promise<any>;
    deleteMenuItem(id: string, req: any): Promise<any>;
    undoMenuItemChange(req: any): Promise<any>;
    redoMenuItemChange(req: any): Promise<any>;
}
