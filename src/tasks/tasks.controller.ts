import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatus } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { Task } from './entity/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasksFilter(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTask(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" retrieving with task id: ${id}}`,
    );
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: UpdateTaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" update task into ${updateStatusTaskDto} for task id: ${id}`,
    );
    updateStatusTaskDto.id = id;
    return this.tasksService.updateTaskStatus(updateStatusTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" delete task id: ${id}`);
    return this.tasksService.deleteTask(id, user);
  }
}
