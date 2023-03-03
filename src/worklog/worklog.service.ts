import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorklogService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}
  async createWorklog(user: User, dto: any) {
    const bodyData = `{
      "comment": {
        "content": [
          {
            "content": [
              {
                "text": "I did some work here.",
                "type": "text"
              }
            ],
            "type": "paragraph"
          }
        ],
        "type": "doc",
        "version": 1
      },
      "started": "2021-01-17T12:34:00.000+0000",
      "timeSpentSeconds": 12000,
      "visibility": {
        "identifier": "276f955c-63d7-42c8-9520-92d01dca0625",
        "type": "group"
      }
    }`;
    const site = '';
    const issueIdOrKey = '';
    const tokenUrl = `https://${site}/rest/api/3/issue/${issueIdOrKey}/worklog`;
    const headers: any = { 'Content-Type': 'application/json' };

    // const tokenResp = (
    //   await lastValueFrom(this.httpService.post(tokenUrl, data, headers))
    // ).data;

    // headers['Authorization'] = `Bearer ${integration.accessToken}`;
    // const searchUrl = `${integration.site}/rest/api/2/search?jql=assignee=currentuser()`;
    // // currently status is not considered.
    // const respTasks = (
    //   await lastValueFrom(this.httpService.get(searchUrl, { headers }))
    // ).data;

    return { msg: 'done' };
  }
}
