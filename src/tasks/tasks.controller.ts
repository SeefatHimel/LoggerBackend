import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto';
import { TasksService } from './tasks.service';
import { Task, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/guard';
import { GetUser } from 'src/decorator';
import { UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getTasks(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(user, createTaskDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
