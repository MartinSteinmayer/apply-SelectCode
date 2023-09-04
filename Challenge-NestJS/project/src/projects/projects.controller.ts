import { Controller, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsEntity } from './entity/projects.entity';
import { Post, Body } from '@nestjs/common';
import { ProjectsDto } from './dto/projects.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get('/')
    async findAll(): Promise<ProjectsEntity[]> {
        return this.projectsService.findAll();
    }

    @Post('/')
    create(@Body() project : ProjectsDto): Promise<ProjectsEntity> {
        const newProject = this.projectsService.createProject(project);
        return newProject;
    }



    
}
