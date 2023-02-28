import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IntegrationType } from '@prisma/client';
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
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_SECRET_KEY,
      code: dto.code,
      redirect_uri: 'http://localhost:3001/integrations/jira/callback',
    };
    console.log(
      '🚀 ~ file: jira.service.ts:35 ~ JiraService ~ createIntegration ~ body:',
      body,
    );
    try {
      const response = await this.httpService
        .post(url, body, { headers })
        .toPromise();
      // return response?.data;
      console.log(
        '🚀 ~ file: jira.service.ts:41 ~ JiraService ~ createIntegration ~ response?.data:',
        response?.data,
      );
      const data = {
        site: 'sample',
        type: IntegrationType.JIRA,
        id: '1',
        accessToken: response?.data.access_token as string,
        refreshToken: response?.data.refresh_token as string,
        userId: user.id as number,
      };
      console.log(
        '🚀 ~ file: jira.service.ts:50 ~ JiraService ~ createIntegration ~ data:',
        data,
      );
      const oldIntegration = await this.prisma.integration.findUnique({
        where: { id: data.id },
      });
      console.log(
        '🚀 ~ file: jira.service.ts:63 ~ JiraService ~ createIntegration ~ oldIntegration:',
        oldIntegration,
      );
      if (oldIntegration) return { message: 'Was Already Integrated' };
      try {
        const integration = await this.prisma.integration.create({
          data,
          select: {
            id: true,
            accessToken: true,
            refreshToken: true,
            site: true,
            user: true,
            userId: true,
          },
        });
        console.log(
          '🚀 ~ file: jira.service.ts:72 ~ JiraService ~ createIntegration ~ integration:',
          integration,
        );
        return { message: 'Integration Successful' };
      } catch (error) {
        console.log('Error');

        throw new BadRequestException('Bad Req');
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: jira.service.ts:92 ~ JiraService ~ createIntegration ~ error:',
        error,
      );
      throw new BadRequestException('Bad Request');
    }
  }
}
