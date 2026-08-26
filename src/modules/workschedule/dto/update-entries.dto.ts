import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleEntryDto } from './create-request.dto';

export class UpdateScheduleEntriesDto {
  @ApiProperty({
    type: [ScheduleEntryDto],
    description: 'Chi tiết lịch làm việc cập nhật',
  })
  @IsArray({ message: 'entries phải là một mảng' })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => ScheduleEntryDto)
  entries: ScheduleEntryDto[];
}
export class UpdatePolicyDto {
  @ApiProperty({
    example: '08:00',
    description: 'Thời gian bắt đầu được đăng ký điểm danh hàng ngày',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  registration_start?: string;

  @ApiProperty({
    example: '17:30',
    description: 'Thời gian kết thúc được đăng ký điểm danh hàng ngày',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  registration_end?: string;

  @ApiProperty({
    example: false,
    description: 'Chốt bảng điểm danh (khóa chỉnh sửa)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  locked?: boolean;
}
export class ScanAttendanceDto {
  @ApiProperty({
    example: 'qr-token-string-here',
    description: 'Mã QR Token quét từ máy điểm danh hoặc app Admin',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class RejectRequestDto {
  @ApiProperty({
    example: 'Không đáp ứng yêu cầu số giờ tối thiểu',
    description: 'Lý do từ chối yêu cầu lịch làm việc',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
export class BulkApproveDto {
  @ApiProperty({
    example: ['reqId1', 'reqId2'],
    description: 'Mảng chứa danh sách ID các yêu cầu cần duyệt',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids: string[];
}
