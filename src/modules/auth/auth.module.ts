import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './common/guard/jwt/jwt.strategy';
import { JwtAuthGuard } from './common/guard/jwt/jwt.guard';
import { RolesGuard } from './common/guard/role/role.guard';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
