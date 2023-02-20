import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy';
import { JiraOAuth2Strategy } from './strategy/jira-auth.strategy';
import { JiraOAuth2Controller } from './controllers/jira-auth.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, JiraOAuth2Controller],
  providers: [AuthService, JwtStrategy, JiraOAuth2Strategy],
})
export class AuthModule {}
