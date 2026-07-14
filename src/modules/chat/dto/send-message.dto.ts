import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'chatId123', description: 'ID của cuộc trò chuyện cần gửi tin nhắn' })
  @IsNotEmpty({ message: 'chatId không được để trống' })
  chatId: string;

  @ApiProperty({ example: 'Hello there!', description: 'Nội dung tin nhắn dạng văn bản (text)', required: false })
  @IsOptional()
  text?: string;
}
