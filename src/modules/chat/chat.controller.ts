import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Api Chat')
@Controller('api/chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat/new')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện mới' })
  async createChat(@Body() body: any, @Req() req: any) {
    return this.chatService.createChat(body, req.user);
  }

  @Get('chat/all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tất cả trò chuyện' })
  async getAllChats(@Req() req: any) {
    return this.chatService.getAllChats(req.user);
  }

  @Post('message')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gửi tin nhắn mới (chứa text hoặc file ảnh)' })
  async sendMessage(@Body() body: any, @Req() req: any) {
    return this.chatService.sendMessage(body, req.user);
  }

  @Get('message/:chatId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tin nhắn theo ID cuộc trò chuyện' })
  @ApiParam({ name: 'chatId', example: 'chatId123' })
  async getMessages(@Param('chatId') chatId: string, @Req() req: any) {
    return this.chatService.getMessages(chatId, req.user);
  }
}
