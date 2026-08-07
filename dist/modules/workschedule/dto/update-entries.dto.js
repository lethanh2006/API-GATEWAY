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
exports.BulkApproveDto = exports.RejectRequestDto = exports.ScanAttendanceDto = exports.UpdatePolicyDto = exports.UpdateScheduleEntriesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_request_dto_1 = require("./create-request.dto");
class UpdateScheduleEntriesDto {
    entries;
}
exports.UpdateScheduleEntriesDto = UpdateScheduleEntriesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_request_dto_1.ScheduleEntryDto], description: 'Chi tiết lịch làm việc cập nhật' }),
    (0, class_validator_1.IsArray)({ message: 'entries phải là một mảng' }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(7),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_request_dto_1.ScheduleEntryDto),
    __metadata("design:type", Array)
], UpdateScheduleEntriesDto.prototype, "entries", void 0);
class UpdatePolicyDto {
    registration_start;
    registration_end;
    locked;
}
exports.UpdatePolicyDto = UpdatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00', description: 'Thời gian bắt đầu được đăng ký điểm danh hàng ngày', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "registration_start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '17:30', description: 'Thời gian kết thúc được đăng ký điểm danh hàng ngày', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "registration_end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Chốt bảng điểm danh (khóa chỉnh sửa)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePolicyDto.prototype, "locked", void 0);
class ScanAttendanceDto {
    token;
}
exports.ScanAttendanceDto = ScanAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'qr-token-string-here', description: 'Mã QR Token quét từ máy điểm danh hoặc app Admin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanAttendanceDto.prototype, "token", void 0);
class RejectRequestDto {
    reason;
}
exports.RejectRequestDto = RejectRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Không đáp ứng yêu cầu số giờ tối thiểu', description: 'Lý do từ chối yêu cầu lịch làm việc' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], RejectRequestDto.prototype, "reason", void 0);
class BulkApproveDto {
    ids;
}
exports.BulkApproveDto = BulkApproveDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['reqId1', 'reqId2'], description: 'Mảng chứa danh sách ID các yêu cầu cần duyệt' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkApproveDto.prototype, "ids", void 0);
//# sourceMappingURL=update-entries.dto.js.map