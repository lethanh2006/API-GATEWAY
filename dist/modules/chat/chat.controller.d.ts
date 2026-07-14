import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChat(body: CreateChatDto, req: any): Promise<any>;
    getAllChats(req: any): Promise<any>;
    sendMessage(body: SendMessageDto, req: any): Promise<any>;
    getMessages(chatId: string, req: any): Promise<any>;
}
