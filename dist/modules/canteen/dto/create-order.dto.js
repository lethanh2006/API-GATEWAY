"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.CreateOrderItemDto = exports.OrderSelectedOptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderSelectedOptionDto {
    name;
    price;
}
exports.OrderSelectedOptionDto = OrderSelectedOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Trứng opla', description: 'Tên tùy chọn kèm theo' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên tùy chọn không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên tùy chọn phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], OrderSelectedOptionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, description: 'Giá của tùy chọn kèm theo (VND)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá tùy chọn không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá tùy chọn phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá tùy chọn phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], OrderSelectedOptionDto.prototype, "price", void 0);
class CreateOrderItemDto {
    menuItemId;
    quantity;
    selectedOptions;
    note;
}
exports.CreateOrderItemDto = CreateOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6691ab2d5cf2a13ba0d7d8c5', description: 'ID món ăn (menuItemId)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID món ăn (menuItemId) không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'ID món ăn phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "menuItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Số lượng đặt mua', default: 1 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Số lượng không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Số lượng phải là số' }),
    (0, class_validator_1.Min)(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' }),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [OrderSelectedOptionDto], description: 'Danh sách tùy chọn chọn thêm' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Danh sách tùy chọn phải là mảng' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderSelectedOptionDto),
    __metadata("design:type", Array)
], CreateOrderItemDto.prototype, "selectedOptions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ít cay, không lấy rau thơm', description: 'Ghi chú cho món ăn' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Ghi chú phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "note", void 0);
class CreateOrderDto {
    tableId;
    items;
    paymentMethod;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '6691ab2d5cf2a13ba0d7d810', description: 'ID bàn ăn (tableId, để trống nếu mang đi - Takeaway)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'ID bàn ăn (tableId) phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "tableId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateOrderItemDto], description: 'Danh sách món ăn trong giỏ hàng' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Danh sách món ăn (items) không được để trống' }),
    (0, class_validator_1.IsArray)({ message: 'Danh sách món ăn phải là mảng' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'CASH', enum: ['CASH', 'VNPAY', 'MOMO', 'VIETQR'], description: 'Phương thức thanh toán', default: 'CASH' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CASH', 'VNPAY', 'MOMO', 'VIETQR'], { message: 'Phương thức thanh toán không hợp lệ' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-order.dto.js.map