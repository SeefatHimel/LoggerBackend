import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { Request } from 'express';

@Controller('auth/jira')
export class JiraOAuth2Controller {
  @Get()
  @UseGuards(AuthGuard('jira-oauth2'))
  login() {
    // Initiates the Jira OAuth 2.0 authentication flow
  }

  @Get('callback')
  @UseGuards(AuthGuard('jira-oauth2'))
  async(@Req() req: Request) {
    // console.log(req);
    // const { access_token, refresh_token, expires_in } = req.user;
    // console.log(access_token, '------\n\n');
    // console.log(refresh_token, '------\n\n');
    // console.log(expires_in, '------\n\n');
  }
}
