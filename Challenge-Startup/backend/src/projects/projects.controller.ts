import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto } from './dto/projects.dto';
import { SupabaseGuard } from '../supabase/guard/supabase.guard';
import { TasksDto } from './tasks/tasks.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(SupabaseGuard)
  @Post('/')
  async create(@Body() createProjectDto: ProjectsDto, @Request() req) {
    return this.projectsService.createProject(createProjectDto, req.user.sub);
  }

  @UseGuards(SupabaseGuard)
  @Get('/')
  async findAll(@Request() req) {
    return this.projectsService.findAll(req.user.sub);
  }

  @UseGuards(SupabaseGuard)
  @Get('/:project_id')
  async findOne(@Param('project_id') id) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(SupabaseGuard)
  @Put('/:project_id')
  async update(@Param('project_id') id, @Body() project: ProjectsDto) {
    return this.projectsService.update(id, project);
  }

  @UseGuards(SupabaseGuard)
  @Delete('/:project_id')
  async remove(@Param('project_id') id) {
    return this.projectsService.remove(id);
  }

    @UseGuards(SupabaseGuard)
    @Get('/:project_id/tasks')
    async getTasks(@Param('project_id') id) {
        return this.projectsService.getTasks(id);
    }

    @UseGuards(SupabaseGuard)
    @Post('/:project_id/tasks')
    async createTask(@Param('project_id') id, @Body() task : TasksDto, @Request() req) {
        return this.projectsService.createTask(id, task, req.user.sub);
    }

    @UseGuards(SupabaseGuard)
    @Put('/:project_id/tasks/:task_id')
    async updateTask(@Param('project_id') projectId, @Param('task_id') taskId, @Body() task : TasksDto, @Request() req) {
        return this.projectsService.updateTask(projectId, taskId, task, req.user.sub);
    }

    @UseGuards(SupabaseGuard)
    @Delete('/:project_id/tasks/:task_id')
    async deleteTask(@Param('project_id') projectId, @Param('task_id') taskId, @Request() req) {
        return this.projectsService.deleteTask(projectId, taskId, req.user.sub);
    }

    @UseGuards(SupabaseGuard)
    @Get('/:project_id/tasks/:user_email')
    async getTasksFromUser(@Param('project_id') projectId, @Param('user_email') userEmail : string ) {
        return this.projectsService.getTasksFromUser(projectId, userEmail);
    }

}
