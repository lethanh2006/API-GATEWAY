import { MenuItemOptionDto } from './create-menu-item.dto';
export declare class UpdateMenuItemDto {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
    options?: MenuItemOptionDto[];
}
