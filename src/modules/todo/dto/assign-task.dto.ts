import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({ example: 'userId456', description: 'ID của người dùng được giao việc' })
  @IsNotEmpty({ message: 'assignedTo không được để trống' })
  assignedTo: string;
}
export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'completed', description: 'Trạng thái mới của công việc (pending, in-progress, completed)' })
  @IsNotEmpty({ message: 'status không được để trống' })
  status: string;
}
