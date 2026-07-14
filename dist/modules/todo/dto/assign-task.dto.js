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
exports.UpdateTaskStatusDto = exports.AssignTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignTaskDto {
    assignedTo;
}
exports.AssignTaskDto = AssignTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'userId456', description: 'ID của người dùng được giao việc' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'assignedTo không được để trống' }),
    __metadata("design:type", String)
], AssignTaskDto.prototype, "assignedTo", void 0);
class UpdateTaskStatusDto {
    status;
}
exports.UpdateTaskStatusDto = UpdateTaskStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed', description: 'Trạng thái mới của công việc (pending, in-progress, completed)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'status không được để trống' }),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "status", void 0);
//# sourceMappingURL=assign-task.dto.js.map