import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly httpService;
    private readonly configService;
    private readonly authServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    validate(request: Request, _payload: unknown): Promise<any>;
}
export {};
