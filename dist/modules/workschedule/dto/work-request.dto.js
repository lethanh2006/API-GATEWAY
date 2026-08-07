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
exports.CreateWorkRequestDto = exports.WorkPeriod = exports.WorkRequestType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var WorkRequestType;
(function (WorkRequestType) {
    WorkRequestType["LEAVE"] = "leave";
    WorkRequestType["LATE"] = "late";
    WorkRequestType["EARLY"] = "early";
    WorkRequestType["OVERTIME"] = "overtime";
    WorkRequestType["BUSINESS_TRIP"] = "business_trip";
    WorkRequestType["REMOTE"] = "remote";
})(WorkRequestType || (exports.WorkRequestType = WorkRequestType = {}));
var WorkPeriod;
(function (WorkPeriod) {
    WorkPeriod["FULL_DAY"] = "full_day";
    WorkPeriod["MORNING"] = "morning";
    WorkPeriod["AFTERNOON"] = "afternoon";
})(WorkPeriod || (exports.WorkPeriod = WorkPeriod = {}));
class CreateWorkRequestDto {
    type;
    start_at;
    end_at;
    period;
    reason;
    location;
    project;
    estimated_cost;
    manager_id;
    attachment_urls;
    is_school_leave;
}
exports.CreateWorkRequestDto = CreateWorkRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WorkRequestType }),
    (0, class_validator_1.IsEnum)(WorkRequestType),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-10T08:30:00.000Z' }),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "start_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-10T17:30:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "end_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WorkPeriod, default: WorkPeriod.FULL_DAY }),
    (0, class_validator_1.IsEnum)(WorkPeriod),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mô tả lý do cụ thể' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWorkRequestDto.prototype, "estimated_cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkRequestDto.prototype, "manager_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateWorkRequestDto.prototype, "attachment_urls", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWorkRequestDto.prototype, "is_school_leave", void 0);
//# sourceMappingURL=work-request.dto.js.map