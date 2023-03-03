import { Version3Client } from 'jira.js';

import { Injectable } from '@nestjs/common';
import { IntegrationType, Task, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getTasks(user: User): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId: user.id },
      include: {
        sessions: true,
      },
    });
  }

  async createTask(user: User, dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: { userId: user.id, ...dto },
    });
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Task> {
    return await this.prisma.task.update({ where: { id }, data: dto });
  }

  async deleteTask(id: number): Promise<Task> {
    return await this.prisma.task.delete({ where: { id } });
  }

  async syncTasks(user: User) {
    // A LOT OF CLEANUP WILL BE REQUIRED
    const integrations = await this.prisma.integration.findMany({
      where: { userId: user.id, type: IntegrationType.JIRA },
    }); // for now only jira
    const tokenUrl = 'https://auth.atlassian.com/oauth/token';
    const headers: any = { 'Content-Type': 'application/json' };

    integrations.forEach(async (integration) => {
      // refresh access token if expired for each integration sites. errors may be thrown if comes.
      // add expiry time to integration access token model

      // const data = {
      //   grant_type: 'refresh_token',
      //   client_id: this.config.get('JIRA_CLIENT_ID'),
      //   client_secret: this.config.get('JIRA_SECRET_KEY'),
      //   refresh_token: integration.refreshToken,
      // };

      // const tokenResp = (
      //   await lastValueFrom(this.httpService.post(tokenUrl, data, headers))
      // ).data;

      // const updated_integration = await this.prisma.integration.update({
      //   where: { id: integration.id },
      //   data: {
      //     accessToken: tokenResp.access_token,
      //     refreshToken: tokenResp.refresh_token,
      //   },
      // });

      // const client = new Version3Client({
      //   host: integration.site as string,
      //   authentication: {
      //     oauth2: {
      //       accessToken: integration.accessToken,
      //     },
      //   },
      // });

      // headers['Authorization'] = `Bearer ${updated_integration.accessToken}`;
      headers['Authorization'] = `Bearer ${integration.accessToken}`;
      const searchUrl = `${integration.site}/rest/api/2/search?jql=assignee=currentuser()`;
      // currently status is not considered.
      const respTasks = (
        await lastValueFrom(this.httpService.get(searchUrl, { headers }))
      ).data;

      console.log(respTasks);

      respTasks.forEach(async (jiraTask: any) => {
        const isExists = await this.prisma.taskIntegration.findUnique({
          where: {
            integratedTaskIdentifier: {
              integratedTaskId: jiraTask.id,
              type: IntegrationType.JIRA,
            },
          },
        });
        if (!isExists) {
          const task = await this.prisma.task.create({
            data: {
              userId: user.id,
              title: jiraTask.fields.summary,
              description: jiraTask.fields.description,
            },
          });
          await this.prisma.taskIntegration.create({
            data: {
              taskId: task.id,
              integratedTaskId: jiraTask.id,
              type: IntegrationType.JIRA,
              url: jiraTask.self,
            },
          });
        }
      });
    });

    // bring tasks from jira sites
    // add tasks to our platform if doesn't exists
  }
}
