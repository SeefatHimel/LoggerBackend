import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard';
import { AuthorizeJiraDto } from './dto';
import { JiraService } from './jira.service';

@Controller('integrations/jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async integrationLink() {
    return this.jiraService.getIntegrationLink(undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createIntegration(@Body() dto: AuthorizeJiraDto) {
    return this.jiraService.createIntegration(dto);
  }
}
