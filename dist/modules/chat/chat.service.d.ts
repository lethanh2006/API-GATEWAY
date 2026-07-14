import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    createChat(dto: any, user: any): Promise<any>;
    getAllChats(user: any): Promise<any>;
    sendMessage(dto: any, user: any): Promise<any>;
    getMessages(chatId: string, user: any): Promise<any>;
}
