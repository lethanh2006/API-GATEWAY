import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ScheduleEntryDto } from './create-request.dto';

export class UpdateScheduleEntriesDto {
  @ApiProperty({ type: [ScheduleEntryDto], description: 'Chi tiết lịch làm việc cập nhật' })
  @IsArray({ message: 'entries phải là một mảng' })
  entries: ScheduleEntryDto[];
}
export class UpdatePolicyDto {
  @ApiProperty({ example: '08:00', description: 'Thời gian bắt đầu được đăng ký điểm danh hàng ngày', required: false })
  registration_start?: string;

  @ApiProperty({ example: '17:30', description: 'Thời gian kết thúc được đăng ký điểm danh hàng ngày', required: false })
  registration_end?: string;

  @ApiProperty({ example: false, description: 'Chốt bảng điểm danh (khóa chỉnh sửa)', required: false })
  locked?: boolean;
}
export class ScanAttendanceDto {
  @ApiProperty({ example: 'qr-token-string-here', description: 'Mã QR Token quét từ máy điểm danh hoặc app Admin' })
  token: string;
}
export class RejectRequestDto {
  @ApiProperty({ example: 'Không đáp ứng yêu cầu số giờ tối thiểu', description: 'Lý do từ chối yêu cầu lịch làm việc' })
  reason: string;
}
export class BulkApproveDto {
  @ApiProperty({ example: ['reqId1', 'reqId2'], description: 'Mảng chứa danh sách ID các yêu cầu cần duyệt' })
  ids: string[];
}
