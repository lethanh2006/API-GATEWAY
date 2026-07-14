import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'userId456', description: 'ID của người dùng muốn tạo cuộc trò chuyện cùng' })
  @IsNotEmpty({ message: 'otherUserId không được để trống' })
  otherUserId: string;
}
