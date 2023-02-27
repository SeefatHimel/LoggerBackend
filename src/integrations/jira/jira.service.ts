import { Injectable } from '@nestjs/common';
import { AuthorizeJiraDto } from './dto';

@Injectable()
export class JiraService {
  async getIntegrationLink(state: string | undefined) {
    let stateParam = '';
    if (state) {
      stateParam = `&state=${state}`;
    }
    return `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=B23TKtFF39H59pJCQotdrzqzEWoxeiUy&scope=read:application-role:jira read:avatar:jira read:project.avatar:jira read:dashboard:jira write:dashboard:jira read:dashboard.property:jira write:dashboard.property:jira read:filter:jira read:comment:jira read:attachment:jira read:issue-meta:jira write:comment:jira read:field:jira write:field:jira read:field.default-value:jira write:field.default-value:jira read:issue-link:jira write:issue-link:jira read:issue-link-type:jira write:issue-link-type:jira read:issue.property:jira read:issue.remote-link:jira write:issue.remote-link:jira read:issue-details:jira read:issue-type:jira write:issue-type:jira read:issue-worklog:jira write:issue-worklog:jira read:issue-worklog.property:jira write:issue-worklog.property:jira read:issue-field-values:jira read:issue-status:jira read:issue.changelog:jira read:issue.vote:jira read:issue.votes:jira read:issue-event:jira read:user:jira read:label:jira read:project:jira write:project:jira read:project-category:jira write:project-category:jira read:project.component:jira write:project.component:jira read:project-role:jira write:project-role:jira read:issue.time-tracking:jira write:issue.time-tracking:jira read:webhook:jira write:webhook:jira read:workflow:jira write:workflow:jira read:status:jira read:role:jira&redirect_uri=http://localhost:3001/integrations/jira/callback/${stateParam}&response_type=code&prompt=consent`;
  }

  async createIntegration(dto: AuthorizeJiraDto) {
    // get access token and refresh tokens and store those on integrations table.
    return 'We are working very hard to integrate this.';
  }
}
