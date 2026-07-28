export declare class OrderSelectedOptionDto {
    name: string;
    price: number;
}
export declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
    selectedOptions?: OrderSelectedOptionDto[];
    note?: string;
}
export declare class CreateOrderDto {
    tableId?: string;
    items: CreateOrderItemDto[];
    paymentMethod?: string;
}
