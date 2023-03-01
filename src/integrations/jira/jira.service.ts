import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
import { lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorizeJiraDto } from './dto';

@Injectable()
export class JiraService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}
  async getIntegrationLink(state: string | undefined) {
    let stateParam = '';
    if (state) {
      stateParam = `&state=${state}`;
    }
    return `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=B23TKtFF39H59pJCQotdrzqzEWoxeiUy&scope=read:application-role:jira read:avatar:jira read:project.avatar:jira read:dashboard:jira write:dashboard:jira read:dashboard.property:jira write:dashboard.property:jira read:filter:jira read:comment:jira read:attachment:jira read:issue-meta:jira write:comment:jira read:field:jira write:field:jira read:field.default-value:jira write:field.default-value:jira read:issue-link:jira write:issue-link:jira read:issue-link-type:jira write:issue-link-type:jira read:issue.property:jira read:issue.remote-link:jira write:issue.remote-link:jira read:issue-details:jira read:issue-type:jira write:issue-type:jira read:issue-worklog:jira write:issue-worklog:jira read:issue-worklog.property:jira write:issue-worklog.property:jira read:issue-field-values:jira read:issue-status:jira read:issue.changelog:jira read:issue.vote:jira read:issue.votes:jira read:issue-event:jira read:user:jira read:label:jira read:project:jira write:project:jira read:project-category:jira write:project-category:jira read:project.component:jira write:project.component:jira read:project-role:jira write:project-role:jira read:issue.time-tracking:jira write:issue.time-tracking:jira read:webhook:jira write:webhook:jira read:workflow:jira write:workflow:jira read:status:jira read:role:jira offline_access&redirect_uri=http://localhost:3001/integrations/jira/callback/${stateParam}&response_type=code&prompt=consent`;
  }

  async createIntegration(dto: AuthorizeJiraDto, user: any) {
    console.log(
      '🚀 ~ file: jira.service.ts:21 ~ JiraService ~ createIntegration ~ user:',
      user,
    );
    // get access token and refresh tokens and store those on integrations table.
    const url = 'https://auth.atlassian.com/oauth/token';
    const headers: any = { 'Content-Type': 'application/json' };
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_SECRET_KEY,
      code: dto.code,
      redirect_uri: 'http://localhost:3000/integrations/jira/callback',
    };

    const resp = (
      await lastValueFrom(this.httpService.post(url, body, { headers }))
    ).data;

    // get resources from jira
    headers['Authorization'] = `Bearer ${resp['access_token']}`;

    const urlResources =
      'https://api.atlassian.com/oauth/token/accessible-resources';

    const respResources = (
      await lastValueFrom(this.httpService.get(urlResources, { headers }))
    ).data;

    // add all available resources in our database if doesn't exist
    respResources.forEach((element: any) => {
      this.prisma.integration.upsert({
        where: {
          integrationIdentifier: { userId: user.id, siteId: element.id },
        },
        update: {
          accessToken: resp.access_token,
          refreshToken: resp.refresh_token,
          site: element.url,
        },
        create: {
          siteId: element.id,
          userId: user.id,
          type: IntegrationType.JIRA,
          accessToken: resp.access_token,
          refreshToken: resp.refresh_token,
          site: element.url,
        },
      });
    });
  }
}
