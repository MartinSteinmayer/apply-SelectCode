import { Controller, Get, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsEntity } from './entity/projects.entity';
import { Post, Body, Request } from '@nestjs/common';
import { ProjectsDto } from './dto/projects.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TasksEntity } from './tasks/tasks.entity';
import { TasksDto } from './tasks/tasks.dto';
import { EventsService } from '../events/events.service';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService, private eventsService : EventsService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    async findAll(@Request() req): Promise<ProjectsEntity[]> {
        return this.projectsService.findProjectsFromUser(req.user.userId);
    }


    @UseGuards(AuthGuard)
    @Post('/')
    create(@Body() project : ProjectsDto, @Request() req): Promise<ProjectsEntity> {
        const authorId = req.user.userId;
        return this.projectsService.createProject(project, authorId);
    }


    @UseGuards(AuthGuard)
    @Put('/:project_id')
    update(@Param('project_id') id: string, @Body() project : ProjectsDto): Promise<ProjectsEntity> {
        return this.projectsService.updateProject(id, project);
    }

    @UseGuards(AuthGuard)
    @Delete('/:project_id')
    delete(@Param('project_id') id: string): Promise<ProjectsEntity> {
        return this.projectsService.deleteProject(id);
    }

    @UseGuards(AuthGuard)
    @Get('/:project_id/tasks')
    findTasksFromProject(@Param('project_id') id: string): Promise<TasksEntity[]> {
        return this.projectsService.findTasksFromProject(id);
    }

    @UseGuards(AuthGuard)
    @Post('/:project_id/tasks')
    async createTask(@Param('project_id') id: string, @Body() task : TasksDto): Promise<TasksEntity> {
        const createdTask = await this.projectsService.createTask(id, task);
        this.eventsService.emitEvent('tasks.created', createdTask);
        return createdTask;
    }

    @UseGuards(AuthGuard)
    @Put('/:project_id/tasks/:task_id')
    updateTask(@Param('project_id') id: string, @Param('task_id') taskId: string, @Body() task : TasksDto): Promise<TasksEntity> {
        return this.projectsService.updateTask(id, taskId, task);
    }

    @UseGuards(AuthGuard)
    @Delete('/:project_id/tasks/:task_id')
    async deleteTask(@Param('project_id') id: string, @Param('task_id') taskId: string): Promise<TasksEntity> {
        const deletedTask = await this.projectsService.deleteTask(id, taskId);
        this.eventsService.emitEvent('tasks.deleted', deletedTask.id);
        return deletedTask;
    }

    
}
