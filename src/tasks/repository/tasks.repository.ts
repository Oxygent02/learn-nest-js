import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TaskStatus } from '../entity/task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entity/task.entity';
import { GetTasksFilterDto } from '../dto/get-task-filter.dto';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTask(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    try {
      const { status, search } = filter;

      const query = this.createQueryBuilder('task');
      query.where({ user });

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filter)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = this.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
      });

      await this.save(task);
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create for user "${user.username}". Data: ${JSON.stringify(
          createTaskDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
