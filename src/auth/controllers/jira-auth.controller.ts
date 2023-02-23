import {
  Body,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { Request, Response } from 'express';
import { TokenErrorFilter } from 'src/filters/token-error.filter';

@Controller('auth/jira')
export class JiraOAuth2Controller {
  @Get()
  @UseGuards(AuthGuard('jira'))
  login() {
    // Initiates the Jira OAuth 2.0 authentication flow
  }

  @Get('callback')
  @UseGuards(AuthGuard('jira'))
  async callback(@Req() req: Request, @Res() res: Response) {
    // This route handler will only be called if the authentication succeeds
    res.redirect('/');
  }
}
