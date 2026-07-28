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
exports.ConsumeIngredientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ConsumeIngredientDto {
    ingredientId;
    quantity;
}
exports.ConsumeIngredientDto = ConsumeIngredientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6691ab2d5cf2a13ba0d7d8c1', description: 'ID nguyên liệu (Ingredient ID)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID nguyên liệu (ingredientId) không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'ID nguyên liệu phải là chuỗi ObjectId' }),
    __metadata("design:type", String)
], ConsumeIngredientDto.prototype, "ingredientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Số lượng khấu trừ sau khi nấu ăn' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Số lượng khấu trừ không được để trống' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Số lượng phải là số' }),
    (0, class_validator_1.Min)(0.001, { message: 'Số lượng khấu trừ phải lớn hơn 0' }),
    __metadata("design:type", Number)
], ConsumeIngredientDto.prototype, "quantity", void 0);
//# sourceMappingURL=consume-ingredient.dto.js.map