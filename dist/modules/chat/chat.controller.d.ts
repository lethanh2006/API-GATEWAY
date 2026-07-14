import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChat(body: any, req: any): Promise<any>;
    getAllChats(req: any): Promise<any>;
    sendMessage(body: any, req: any): Promise<any>;
    getMessages(chatId: string, req: any): Promise<any>;
}
