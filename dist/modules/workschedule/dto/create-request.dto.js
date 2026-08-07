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
exports.CreateScheduleRequestDto = exports.ScheduleEntryDto = exports.ScheduleEntryType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const work_request_dto_1 = require("./work-request.dto");
var ScheduleEntryType;
(function (ScheduleEntryType) {
    ScheduleEntryType["OFFICE"] = "office";
    ScheduleEntryType["REMOTE"] = "remote";
    ScheduleEntryType["DAY_OFF"] = "day_off";
    ScheduleEntryType["LEAVE"] = "leave";
})(ScheduleEntryType || (exports.ScheduleEntryType = ScheduleEntryType = {}));
class ScheduleEntryDto {
    date;
    type;
    period;
    note;
}
exports.ScheduleEntryDto = ScheduleEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-20', description: 'Ngày của lịch làm việc (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleEntryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ScheduleEntryType, example: ScheduleEntryType.OFFICE }),
    (0, class_validator_1.IsEnum)(ScheduleEntryType),
    __metadata("design:type", String)
], ScheduleEntryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: work_request_dto_1.WorkPeriod, example: work_request_dto_1.WorkPeriod.FULL_DAY }),
    (0, class_validator_1.IsEnum)(work_request_dto_1.WorkPeriod),
    __metadata("design:type", String)
], ScheduleEntryDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ScheduleEntryDto.prototype, "note", void 0);
class CreateScheduleRequestDto {
    week_start;
    entries;
}
exports.CreateScheduleRequestDto = CreateScheduleRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-20', description: 'Ngày đầu tiên của tuần đăng ký (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'week_start không được để trống' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduleRequestDto.prototype, "week_start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ScheduleEntryDto], description: 'Chi tiết lịch đăng ký từng ngày trong tuần' }),
    (0, class_validator_1.IsArray)({ message: 'entries phải là một mảng' }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScheduleEntryDto),
    __metadata("design:type", Array)
], CreateScheduleRequestDto.prototype, "entries", void 0);
//# sourceMappingURL=create-request.dto.js.map