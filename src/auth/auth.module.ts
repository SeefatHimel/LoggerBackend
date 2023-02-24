import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy';
import { JiraOAuth2Strategy } from './strategy/jira.strategy';
import { JiraOAuth2Controller } from './controllers/jira-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { TokenErrorFilter } from 'src/filters/token-error.filter';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({})],
  controllers: [AuthController, JiraOAuth2Controller],
  providers: [
    AuthService,
    JwtStrategy,
    JiraOAuth2Strategy,
    {
      provide: APP_FILTER,
      useClass: TokenErrorFilter,
    },
  ],
})
export class AuthModule {}
