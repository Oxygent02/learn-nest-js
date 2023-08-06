import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatus } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './repository/tasks.repository';
import { Task } from './entity/task.entity';
import { User } from 'src/auth/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly configService: ConfigService,
  ) {}

  async getTask(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTask(filter, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, user },
    });
    if (!found) {
      throw new NotFoundException(`Task with ${id} is not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    // #Option 1
    // const taskToDelete = await this.getTaskById(id);
    // const deleteTask = await this.taskRepository.remove(taskToDelete);
    // return deleteTask;
    // #Option 2
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected <= 0) {
      throw new NotFoundException(`Task with ${id} is not found`);
    }
    return;
  }

  async updateTaskStatus(dto: UpdateTaskStatus, user: User): Promise<Task> {
    // #Option 1
    // const { id, status } = dto;
    // const result = await this.taskRepository.update(id, { status });
    // if (result.affected <= 0) {
    //   throw new NotFoundException(`Task with ${id} is not found`);
    // }
    // return;
    // #Option 2

    const { id, status } = dto;
    const data = await this.getTaskById(id, user);
    const result = await this.taskRepository.update(data, { status });
    if (result.affected <= 0) {
      throw new NotFoundException(`Task with ${id} is not found`);
    }
    data.status = status;
    return data;
  }
}
