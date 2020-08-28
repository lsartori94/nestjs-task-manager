import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaskWithFilters(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  // With or w/o /
  // @Get(':id')
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task{
    return this.taskService.getTaskById(id);
  }

  // Full Body extraction
  // @Post()
  // createTask(@Body() body) {
  //   console.log('body', body);
  // }
  // Body parameters extraction
  // @Post()
  // createTask(
  //   @Body('title') title: string,
  //   @Body('description') description: string,
  // )
  // DTO based Body extraction
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus
  ) {
    return this.taskService.updateTaskStatus(id, status);
  }
}
