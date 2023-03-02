import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { JwtAuthGuard } from 'src/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getIntegrations(@GetUser() user: User, @Body() dto: any) {
    console.log(
      '🚀 ~ file: integrations.controller.ts:14 ~ IntegrationsController ~ getIntegrations ~ user:',
      user,
    );
    const integrations = await this.prisma.integration.findMany({
      where: { userId: user.id },
    });
    console.log(
      '🚀 ~ file: integrations.controller.ts:25 ~ IntegrationsController ~ getIntegrations ~ integrations:',
      integrations,
    );
    // const oldUser = await this.prisma.user.findUnique({
    //   where: { email: user.email },
    // });
    // console.log(
    //   '🚀 ~ file: integrations.controller.ts:25 ~ IntegrationsController ~ getIntegrations ~ oldUser:',
    //   oldUser,
    //   oldUser?.integrations,
    // );
    // return await this.integrationsService.createSession(user, dto);
    return { integrations: integrations };
  }
}
