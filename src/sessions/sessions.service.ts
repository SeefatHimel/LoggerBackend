import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionDto } from './dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async getSessions(user: User, taskId: number) {
    await this.validateTaskAccess(user, taskId);

    const activeSession = await this.prisma.session.findFirst({
      where: { taskId, endTime: null },
    });
    const completedSessions = await this.prisma.session.findMany({
      where: { taskId, endTime: { not: null } },
    });
    return { activeSession, completedSessions };
  }

  async createSession(user: User, dto: SessionDto) {
    await this.validateTaskAccess(user, dto.taskId);

    const activeSession = await this.prisma.session.findFirst({
      where: { taskId: dto.taskId, endTime: null },
    });

    if (activeSession) {
      await this.stopSessionUtil(activeSession.id);
    }

    return await this.prisma.session.create({
      data: { ...dto },
    });
  }

  async stopSession(user: User, taskId: number) {
    await this.validateTaskAccess(user, taskId);

    const activeSession = await this.prisma.session.findFirst({
      where: { taskId, endTime: null },
    });

    if (!activeSession) {
      throw new BadRequestException('No active session');
    }

    return await this.stopSessionUtil(activeSession.id);
  }

  async validateTaskAccess(user: User, taskId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.userId !== user.id) {
      throw new UnauthorizedException('You do not have access to this task');
    }
  }

  async stopSessionUtil(sessionId: number) {
    return await this.prisma.session.update({
      where: { id: sessionId },
      data: { endTime: new Date(), status: SessionStatus.STOPPED },
    });
  }
}
