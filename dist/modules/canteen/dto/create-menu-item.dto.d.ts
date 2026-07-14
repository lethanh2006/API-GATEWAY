export declare class MenuItemOptionDto {
    name: string;
    price: number;
}
export declare class CreateMenuItemDto {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    options?: MenuItemOptionDto[];
}
