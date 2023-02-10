import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(user: User, dto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: { userId: user.id, ...dto },
    });
  }

  async getTasks(user: User): Promise<Task[]> {
    return await this.prisma.task.findMany({ where: { userId: user.id } });
  }

  async deleteTask(id: number): Promise<Task> {
    return await this.prisma.task.delete({ where: { id } });
  }
}
