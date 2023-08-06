import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './repository/tasks.repository';
import { Task } from './entity/task.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
