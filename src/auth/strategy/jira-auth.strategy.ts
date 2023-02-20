import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import JiraClient from 'jira-connector';
import { Strategy, VerifyCallback } from 'passport-oauth2';

@Injectable()
export class JiraOAuth2Strategy extends PassportStrategy(
  Strategy,
  'jira-oauth2',
) {
  constructor(private config: ConfigService) {
    super({
      authorizationURL: 'https://auth.atlassian.com/authorize',
      tokenURL: 'https://auth.atlassian.com/oauth/token',
      clientID: config.get('JIRA_CLIENT_ID'),
      clientSecret: config.get('JIRA_SECRET_KEY'),
      callbackURL: config.get('JIRA_CALLBACK_URL'),
      accessType: 'offline',
      scope: [
        'read:jira-user',
        'read:jira-work',
        'write:jira-work',
        'offline_access',
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
    const jiraApi = new JiraClient({
      host: 'your-domain.atlassian.net',
      oauth: {
        consumer_key: 'your-client-id',
        private_key: 'your-private-key',
        token: accessToken,
        token_secret: refreshToken,
      },
    });
    const myself = await jiraApi.myself.getMyself();
    return myself;
    // console.log('LOG: ACCESS-TOKEN', accessToken);
    // console.log('LOG: REFRESH-TOKEN', refreshToken);
    // console.log('LOG: PROFILE', profile);
  }
}
