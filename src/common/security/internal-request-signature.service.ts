import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";

@Injectable()
export class InternalRequestSignatureService {
  private readonly secret: string | undefined;
  private readonly production: boolean;

  constructor(configService: ConfigService) {
    this.secret = configService.get<string>("CANTEEN_INTERNAL_SECRET");
    this.production = configService.get<string>("NODE_ENV") === "production";
  }

  signUserPayload(payload: string, requestId: string): Record<string, string> {
    if (!this.secret || (this.production && this.secret.length < 32)) {
      if (this.production) {
        throw new ServiceUnavailableException(
          "Gateway chưa được cấu hình để gọi dịch vụ căn tin",
        );
      }
      return { "x-user-payload": payload };
    }

    const timestamp = Date.now().toString();
    const signature = createHmac("sha256", this.secret)
      .update(`${timestamp}.${requestId}.${payload}`)
      .digest("hex");

    return {
      "x-user-payload": payload,
      "x-user-timestamp": timestamp,
      "x-user-signature": signature,
    };
  }
}
