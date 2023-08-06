import { TaskStatus } from '../entity/task-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTaskStatus {
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
