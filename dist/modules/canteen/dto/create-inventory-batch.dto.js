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
exports.CreateInventoryBatchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateInventoryBatchDto {
    ingredientId;
    quantity;
    expiryDate;
    costPrice;
    supplier;
}
exports.CreateInventoryBatchDto = CreateInventoryBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6691ab2d5cf2a13ba0d7d8c1', description: 'ID nguyên liệu (Ingredient ID)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID nguyên liệu (ingredientId) không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'ID nguyên liệu phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], CreateInventoryBatchDto.prototype, "ingredientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Số lượng nguyên liệu nhập kho' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Số lượng nhập không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Số lượng phải là số' }),
    (0, class_validator_1.Min)(0.001, { message: 'Số lượng nhập phải lớn hơn 0' }),
    __metadata("design:type", Number)
], CreateInventoryBatchDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-15', description: 'Hạn sử dụng (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Hạn sử dụng (expiryDate) không được để trống' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Hạn sử dụng phải đúng định dạng ISO Date (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateInventoryBatchDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85000, description: 'Giá nhập lô hàng (VND)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá nhập không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá nhập phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá nhập phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateInventoryBatchDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Công ty Thực Phẩm Sạch CP', description: 'Tên nhà cung cấp', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tên nhà cung cấp phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateInventoryBatchDto.prototype, "supplier", void 0);
//# sourceMappingURL=create-inventory-batch.dto.js.map