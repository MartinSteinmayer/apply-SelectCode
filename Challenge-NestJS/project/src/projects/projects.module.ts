import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsEntity } from './entity/projects.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TasksEntity } from './tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity, TasksEntity]), AuthModule, UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
