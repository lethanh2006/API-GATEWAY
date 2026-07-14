import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Báo cáo doanh thu', description: 'Tiêu đề của công việc cần làm' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ example: 'Hoàn thành báo cáo quý trước thứ Sáu', description: 'Mô tả chi tiết về công việc', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'high', description: 'Mức độ ưu tiên (low, medium, high)', required: false })
  @IsOptional()
  priority?: string;

  @ApiProperty({ example: '2026-07-20T17:00:00.000Z', description: 'Thời hạn hoàn thành công việc', required: false })
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: 'userId456', description: 'ID của người dùng được phân công việc', required: false })
  @IsOptional()
  assignedTo?: string;
}
