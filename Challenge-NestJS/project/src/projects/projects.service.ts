import { Injectable } from '@nestjs/common';
import { ProjectsEntity } from './entity/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsDto } from './dto/projects.dto';

@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(ProjectsEntity)
        private projectsRepository: Repository<ProjectsEntity>,
      ) {}

    findAll(): Promise<ProjectsEntity[]> {
        return this.projectsRepository.find();
    }

    findById(id: number): Promise<ProjectsEntity | undefined> {
        return this.projectsRepository.findOneBy({ id });
    }

    createProject(project: ProjectsDto): Promise<ProjectsEntity> {
        const newProject = this.projectsRepository.create(project);
        return this.projectsRepository.save(newProject);
    }
}
