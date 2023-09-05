import { Injectable } from '@nestjs/common';
import { ProjectsEntity } from './entity/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsDto } from './dto/projects.dto';
import { UsersService } from '../users/users.service';
import { TasksEntity } from './tasks/tasks.entity';
import { TasksDto } from './tasks/tasks.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private projectsRepository: Repository<ProjectsEntity>,
    private readonly usersService: UsersService,
    @InjectRepository(TasksEntity)
    private tasksRepository: Repository<TasksEntity>,
  ) {}

  findProjectsFromUser(userId: number): Promise<ProjectsEntity[]> {
    return this.projectsRepository.find({ where: { author: userId } });
  }

  findById(id: number): Promise<ProjectsEntity | undefined> {
    return this.projectsRepository.findOneBy({ id });
  }

  async createProject(
    project: ProjectsDto,
    authorId: number,
  ): Promise<ProjectsEntity> {
    const newProject = this.projectsRepository.create(project);

    newProject.author = authorId;

    const savedProject = await this.projectsRepository.save(newProject);
    this.usersService.addProject(authorId, savedProject);

    return savedProject;
  }

  async updateProject(
    id: string,
    project: ProjectsDto,
  ): Promise<ProjectsEntity> {
    const projectToUpdate = await this.findById(Number(id));

    if (!projectToUpdate) {
      throw new Error('Project not found');
    }

    projectToUpdate.name = project.name;
    projectToUpdate.description = project.description;
    projectToUpdate.createdDate = project.createdDate;

    const updatedProject = await this.projectsRepository.save(projectToUpdate);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<ProjectsEntity> {
    const projectToDelete = await this.findById(Number(id));

    if (!projectToDelete) {
      throw new Error('Project not found');
    }

    const deletedProject = await this.projectsRepository.delete(id);
    return projectToDelete;
  }

  async findTasksFromProject(id: string): Promise<TasksEntity[]> {
    return this.tasksRepository.find({ where: { project: Number(id) } });
  }

    async createTask(id: string, task: TasksDto): Promise<TasksEntity> {
        const project = await this.findById(Number(id));
        if (!project) {
            throw new Error('Project not found');
        }
        if (!project.tasks) {
            project.tasks = [];
        }
        const newTask = this.tasksRepository.create(task);
        newTask.project = project.id;
        const savedTask = await this.tasksRepository.save(newTask);
        project.tasks.push(savedTask.id);
        await this.projectsRepository.save(project);
        return savedTask;
    }
    
    async updateTask(project_id: string, taskId: string, task: TasksDto): Promise<TasksEntity> {
        const project = await this.findById(Number(project_id));
        if (!project) {
            throw new Error('Project not found');
        }

        const taskToUpdate = await this.tasksRepository.findOne({ where: { id: Number(taskId) } });
        if (!taskToUpdate) {
            throw new Error('Task not found');
        }

        taskToUpdate.name = task.name;
        taskToUpdate.description = task.description;
        taskToUpdate.createdDate = task.createdDate;

        const updatedTask = await this.tasksRepository.save(taskToUpdate);
        return updatedTask;
    }

    async deleteTask(project_id: string, taskId: string): Promise<TasksEntity> {
        const project = await this.findById(Number(project_id));
        if (!project) {
            throw new Error('Project not found');
        }

        const taskToDelete = await this.tasksRepository.findOne({ where: { id: Number(taskId) } });
        if (!taskToDelete) {
            throw new Error('Task not found');
        }

        const deletedTask = await this.tasksRepository.delete(taskId);
        return taskToDelete;
    }

}
