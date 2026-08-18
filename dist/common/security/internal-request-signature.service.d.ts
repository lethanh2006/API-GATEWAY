import { ConfigService } from "@nestjs/config";
export declare class InternalRequestSignatureService {
    private readonly secret;
    private readonly production;
    constructor(configService: ConfigService);
    signUserPayload(payload: string, requestId: string): Record<string, string>;
}
