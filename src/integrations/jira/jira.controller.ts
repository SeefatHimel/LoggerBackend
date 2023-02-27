import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard';
import { JiraService } from './jira.service';

@Controller('jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async integrationLink() {
    return this.jiraService.getIntegrationLink(undefined);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createIntegration(@Body dto: any) {
    // TODO: add dto type
    return this.jiraService.createIntegration(dto); // TODO: create an integration from authorization code.
  }
}
