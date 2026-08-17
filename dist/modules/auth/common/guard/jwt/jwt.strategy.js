"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const rxjs_1 = require("rxjs");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-1gio') {
    httpService;
    configService;
    authServiceUrl;
    constructor(httpService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-super-secret-key-chatapp',
            passReqToCallback: true,
        });
        this.httpService = httpService;
        this.configService = configService;
        this.authServiceUrl = this.configService.get('AUTH_SERVICE_URL', 'http://localhost:4000');
    }
    async validate(request, _payload) {
        const authorization = request.headers.authorization;
        if (!authorization)
            throw new common_1.UnauthorizedException('Thiếu access token');
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.authServiceUrl}/api/auth/introspect`, {}, { headers: { Authorization: authorization } }));
            if (!data?.valid || !data?.user) {
                throw new common_1.UnauthorizedException('Token không còn hiệu lực');
            }
            return data.user;
        }
        catch {
            throw new common_1.UnauthorizedException('Token không còn hiệu lực');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map