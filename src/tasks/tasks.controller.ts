import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto';
import { TasksService } from './tasks.service';
import { Task, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/guard';
import { GetUser } from 'src/decorator';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    console.log(createTaskDto);
    return this.tasksService.createTask(user, createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getTasks(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }
}
