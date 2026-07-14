import { CanteenService } from './canteen.service';
export declare class CanteenController {
    private readonly canteenService;
    constructor(canteenService: CanteenService);
    getMenu(): Promise<any>;
    createMenuItem(body: any, req: any): Promise<any>;
}
