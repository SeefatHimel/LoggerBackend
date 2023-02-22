import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy';
import { JiraOAuth2Strategy } from './strategy/jira-auth.strategy';
import { JiraOAuth2Controller } from './controllers/jira-auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleOAuth2Controller } from './controllers/google-auth.controler';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, JiraOAuth2Controller, GoogleOAuth2Controller],
  providers: [AuthService, JwtStrategy, JiraOAuth2Strategy, GoogleStrategy],
})
export class AuthModule {}
