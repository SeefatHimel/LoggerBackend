import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IntegrationType, User } from '@prisma/client';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JiraClient } from 'src/utils/jira';

@Injectable()
export class JiraOAuth2Strategy extends PassportStrategy(Strategy, 'jira') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      authorizationURL: 'https://auth.atlassian.com/authorize',
      tokenURL: 'https://auth.atlassian.com/oauth/token',
      clientID: config.get('JIRA_CLIENT_ID'),
      clientSecret: config.get('JIRA_SECRET_KEY'),
      callbackURL: config.get('JIRA_CALLBACK_URL'),
      accessType: 'offline',
      scope: [
        'read:me',
        'read:account',
        'read:jira-user',
        'read:jira-work',
        'write:jira-work',
        'offline_access',
        'read:application-role:jira',
        'read:avatar:jira',
        'read:project.avatar:jira',
        'read:dashboard:jira',
        'write:dashboard:jira',
        'read:dashboard.property:jira',
        'write:dashboard.property:jira',
        'read:filter:jira',
        'read:comment:jira',
        'read:attachment:jira',
        'read:issue-meta:jira',
        'write:comment:jira',
        'read:field:jira',
        'write:field:jira',
        'read:field.default-value:jira',
        'write:field.default-value:jira',
        'read:issue-link:jira',
        'write:issue-link:jira',
        'read:issue-link-type:jira',
        'write:issue-link-type:jira',
        'read:issue.property:jira',
        'read:issue.remote-link:jira',
        'write:issue.remote-link:jira',
        'read:issue-details:jira',
        'read:issue-type:jira',
        'write:issue-type:jira',
        'read:issue-worklog:jira',
        'write:issue-worklog:jira',
        'read:issue-worklog.property:jira',
        'write:issue-worklog.property:jira',
        'read:issue-field-values:jira',
        'read:issue-status:jira',
        'read:issue.changelog:jira',
        'read:issue.vote:jira',
        'read:issue.votes:jira',
        'read:issue-event:jira',
        'read:user:jira',
        'read:label:jira',
        'read:project:jira',
        'write:project:jira',
        'read:project-category:jira',
        'write:project-category:jira',
        'read:project.component:jira',
        'write:project.component:jira',
        'read:project-role:jira',
        'write:project-role:jira',
        'read:issue.time-tracking:jira',
        'write:issue.time-tracking:jira',
        'read:webhook:jira',
        'write:webhook:jira',
        'read:workflow:jira',
        'write:workflow:jira',
        'read:status:jira',
        'read:role:jira',
      ],
      skipUserProfile: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const client = new JiraClient(accessToken);
    const myProfile = await client.getMyProfile();

    let user = await this.prisma.user.findUnique({
      where: {
        email: myProfile.email,
      },
    });

    const data = {
      email: myProfile.email,
      name: myProfile.name,
      picture: myProfile.picture,
    };

    if (!user) {
      user = await this.prisma.user.create({
        data,
      });
    }

    let integration = await this.prisma.integrations.findUnique({
      where: {
        id: myProfile.account_id,
      },
    });

    if (!integration) {
      integration = await this.prisma.integrations.create({
        data: {
          userId: user.id,
          id: myProfile.account_id as string,
          type: IntegrationType.JIRA,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }

    return user;
  }
}
