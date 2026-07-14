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
exports.CreateMenuItemDto = exports.MenuItemOptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MenuItemOptionDto {
    name;
    price;
}
exports.MenuItemOptionDto = MenuItemOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thêm trân châu', description: 'Tên tùy chọn thêm' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên tùy chọn không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên tùy chọn phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], MenuItemOptionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, description: 'Giá của tùy chọn thêm' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá tùy chọn không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá tùy chọn phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá tùy chọn phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], MenuItemOptionDto.prototype, "price", void 0);
class CreateMenuItemDto {
    categoryId;
    name;
    description;
    price;
    imageUrl;
    isAvailable;
    options;
}
exports.CreateMenuItemDto = CreateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6691ab2d5cf2a13ba0d7d8c1', description: 'ID danh mục món ăn (Category ID)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Danh mục (categoryId) không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Danh mục (categoryId) phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cơm tấm sườn bì chả', description: 'Tên món ăn' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên món ăn không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên món ăn phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cơm tấm sườn nướng mật ong thơm ngon', description: 'Mô tả món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mô tả phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 35000, description: 'Giá bán của món ăn' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Giá món ăn không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá món ăn phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá món ăn phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://image-url-here.png', description: 'Đường dẫn hình ảnh món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Đường dẫn ảnh phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Món ăn có sẵn hay không', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Trạng thái có sẵn phải là kiểu boolean' }),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MenuItemOptionDto], description: 'Danh sách tùy chọn kèm theo', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Danh sách tùy chọn phải là mảng' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MenuItemOptionDto),
    __metadata("design:type", Array)
], CreateMenuItemDto.prototype, "options", void 0);
//# sourceMappingURL=create-menu-item.dto.js.map