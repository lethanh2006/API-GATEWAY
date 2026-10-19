import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { filterSupportedChatImage } from './chat-image-upload';
import { ChatService, type UploadedChatImage } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

/** Trò chuyện 1-1 và gửi ảnh; chuyển tiếp tới Chat. */
@ApiTags('Api Chat')
@Controller('api/chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat/new')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện mới' })
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.chatService.createChat(body, req.user);
    response.status(result.statusCode);
    return result.body;
  }

  @Get('chat/all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tất cả trò chuyện' })
  getAllChats(@Req() req: AuthenticatedRequest) {
    return this.chatService.getAllChats(req.user);
  }

  @Post('message')
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) =>
        filterSupportedChatImage(file, callback),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['chatId'],
      properties: {
        chatId: { type: 'string' },
        text: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Gửi tin nhắn mới (chứa text hoặc file ảnh)' })
  sendMessage(
    @Body() body: SendMessageDto,
    @UploadedFile() image: UploadedChatImage | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.chatService.sendMessage(body, image, req.user);
  }

  @Get('message/:chatId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tin nhắn theo ID cuộc trò chuyện' })
  @ApiParam({ name: 'chatId', example: 'chatId123' })
  getMessages(
    @Param('chatId') chatId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.chatService.getMessages(chatId, req.user);
  }
}
