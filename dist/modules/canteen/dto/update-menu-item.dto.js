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
exports.UpdateMenuItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_menu_item_dto_1 = require("./create-menu-item.dto");
class UpdateMenuItemDto {
    categoryId;
    name;
    description;
    price;
    imageUrl;
    isAvailable;
    options;
}
exports.UpdateMenuItemDto = UpdateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6691ab2d5cf2a13ba0d7d8c1', description: 'ID danh mục món ăn (Category ID)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Danh mục (categoryId) phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cơm tấm sườn bì chả đặc biệt', description: 'Tên món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tên món ăn phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ngon tuyệt hảo', description: 'Mô tả món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mô tả phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40000, description: 'Giá bán của món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Giá món ăn phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Giá món ăn phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://image-url-here.png', description: 'Đường dẫn hình ảnh món ăn', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Đường dẫn ảnh phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Món ăn có sẵn hay không', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Trạng thái có sẵn phải là kiểu boolean' }),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_menu_item_dto_1.MenuItemOptionDto], description: 'Danh sách tùy chọn kèm theo', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Danh sách tùy chọn phải là mảng' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_menu_item_dto_1.MenuItemOptionDto),
    __metadata("design:type", Array)
], UpdateMenuItemDto.prototype, "options", void 0);
//# sourceMappingURL=update-menu-item.dto.js.map