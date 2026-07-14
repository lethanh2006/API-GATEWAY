import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class ScheduleEntryDto {
  @ApiProperty({ example: '2026-07-20', description: 'Ngày của lịch làm việc (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({ example: '08:00', description: 'Giờ bắt đầu làm việc' })
  start_time: string;

  @ApiProperty({ example: '17:00', description: 'Giờ kết thúc làm việc' })
  end_time: string;
}

export class CreateScheduleRequestDto {
  @ApiProperty({ example: '2026-07-20', description: 'Ngày đầu tiên của tuần đăng ký (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'week_start không được để trống' })
  week_start: string;

  @ApiProperty({ type: [ScheduleEntryDto], description: 'Chi tiết lịch đăng ký từng ngày trong tuần' })
  @IsArray({ message: 'entries phải là một mảng' })
  entries: ScheduleEntryDto[];
}
