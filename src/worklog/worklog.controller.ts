import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { WorklogService } from './worklog.service';

@Controller('worklog')
export class WorklogController {
  constructor(private readonly worklogService: WorklogService) {}

  @Post()
  async createWorklog(@GetUser() user: User, @Body() dto: any) {
    return await this.worklogService.createWorklog(user, dto);
  }
}
