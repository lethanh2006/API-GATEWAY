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
exports.CreateIngredientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIngredientDto {
    name;
    unit;
    minimumThreshold;
}
exports.CreateIngredientDto = CreateIngredientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thịt gà', description: 'Tên nguyên liệu' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên nguyên liệu không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên nguyên liệu phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kg', description: 'Đơn vị tính (kg, lít, bó...)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Đơn vị tính không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Đơn vị tính phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Ngưỡng cảnh báo tồn kho tối thiểu' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Ngưỡng cảnh báo tối thiểu không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Ngưỡng cảnh báo tối thiểu phải là số' }),
    (0, class_validator_1.Min)(0, { message: 'Ngưỡng cảnh báo tối thiểu phải lớn hơn hoặc bằng 0' }),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "minimumThreshold", void 0);
//# sourceMappingURL=create-ingredient.dto.js.map