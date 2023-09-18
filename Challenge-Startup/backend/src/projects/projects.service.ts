import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ProjectsDto } from './dto/projects.dto';
import { TasksDto } from './tasks/tasks.dto';
import { MailService } from '../mail/mail.service';

type Project = {
    id: number;
    name: string;
    description: string;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
};

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService, private mailService : MailService) {}

  async createProject(createProjectDto: ProjectsDto, userId: string) {
    const supabaseClient = await this.supabaseService.getClient();

    const newProject = {
      ...createProjectDto,
      owner_id: userId,
    };

    const { error } = await supabaseClient
      .from('projects')
      .insert([newProject]);

    if (error) {
      throw new Error(error.message);
    }

    return newProject;
  }

  async findAll(userId: string) {
    const supabaseClient = await this.supabaseService.getClient();

    const { data, error } = await supabaseClient
      .from('projects')
      .select()
      .eq('owner_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

    async findOne(id: number) : Promise<Project>{
        const supabaseClient = await this.supabaseService.getClient();
    
        const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('id', id);
    
        if (error) {
        throw new Error(error.message);
        }
    
        return data[0];
    }

    async update(id: number, project: ProjectsDto) {
        const supabaseClient = await this.supabaseService.getClient();

        const newProject = {
            ...project,
            updated_at: new Date(),
        };
    
        const { data, error } = await supabaseClient
        .from('projects')
        .update(newProject)
        .eq('id', id)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return newProject;
    }

    async remove(id: number) {
        const supabaseClient = await this.supabaseService.getClient();

        const project = await this.findOne(id);
    
        const { data, error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', id)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return project;
    }

    async getTasks(id: number) {
        const supabaseClient = await this.supabaseService.getClient();
    
        const { data, error } = await supabaseClient
        .from('tasks')
        .select()
        .eq('project_id', id)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return data;
    }

    async createTask(project_id: number, task : TasksDto, userId: string) {
        const supabaseClient = await this.supabaseService.getClient();

        const project : Project = await this.findOne(project_id);

        if (!project) {
            throw new Error('Project not found');
        }
        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project');
        }
    
        const newTask = {
            ...task,
            project_id: project_id,
        };
    
        const { error } = await supabaseClient
        .from('tasks')
        .insert([newTask]);
    
        if (error) {
        throw new Error(error.message);
        }

        return newTask;
    }

    async assignTask(project_id: number, task_id : number, assignTaskDto : {user_email : string}, userId: string) {
        const supabaseClient = await this.supabaseService.getClient();
        const user = await supabaseClient.from('profiles').select().eq('email', assignTaskDto.user_email);
        const task = await this.getTask(project_id, task_id);

        const project : Project = await this.findOne(project_id);
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project');
        }

        const { error } = await supabaseClient
        .from('task_assignments')
        .insert([{task_id: task_id, user_id: user.data[0].id}]);
    
        if (error) {
        throw new Error(error.message);
        }

        await this.mailService.sendEmail(assignTaskDto.user_email);
    
        return task;
    }

    async unassignTask(project_id: number, task_id : number, assignTaskDto : {user_email : string}, userId: string) {
        const supabaseClient = await this.supabaseService.getClient();
        const user = await supabaseClient.from('profiles').select().eq('email', assignTaskDto.user_email);
        const task = await this.getTask(project_id, task_id);

        const project : Project = await this.findOne(project_id);
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project');
        }

        const { error } = await supabaseClient
        .from('task_assignments')
        .delete()
        .eq('task_id', task_id)
        .eq('user_id', user.data[0].id);
    
        if (error) {
        throw new Error(error.message);
        }
    
        return task;
    }


    async getTask(project_id: number, task_id : number) {
        const supabaseClient = await this.supabaseService.getClient();
    
        const { data, error } = await supabaseClient
        .from('tasks')
        .select()
        .eq('project_id', project_id)
        .eq('id', task_id)
    
        if (error) {
        throw new Error(error.message);
        }

        if (data.length === 0) {
            throw new Error('Task not found');
        }
    
        return data[0];
    }    

    async updateTask(project_id: number, task_id : number,  task: TasksDto, userId: string) {
        const supabaseClient = await this.supabaseService.getClient();

        const project : Project = await this.findOne(project_id);
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project');
        }

        const newTask = {
            ...task,
            updated_at: new Date(),
        };
    
        const { error } = await supabaseClient
        .from('tasks')
        .update(newTask)
        .eq('id', task_id)

    
        if (error) {
        throw new Error(error.message);
        }
    
        return newTask;
    }

    async deleteTask(project_id: number, task_id : number, userId: string) {
        const supabaseClient = await this.supabaseService.getClient();

        const project : Project = await this.findOne(project_id);
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project');
        }

        const task = await this.getTask(project_id, task_id);
        const { error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', task_id)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return task;
    }

    async getTasksFromUser(userID : string) {
        const supabaseClient = await this.supabaseService.getClient();
        const tasks = await supabaseClient.from("task_assignments").select().eq('user_id', userID);
        const taskIds = tasks.data.map(task => task.task_id);
    
        const { data, error } = await supabaseClient
        .from('tasks')
        .select()
        .filter('id', 'in', taskIds)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return data;
    }
        

    async getTasksFromUserAndProject(project_id: number, userEmail : string ) {
        const supabaseClient = await this.supabaseService.getClient();
        const user = await supabaseClient.from('profiles').select().eq('email', userEmail);
        const tasks = await supabaseClient.from("task_assignments").select().eq('user_id', user.data[0].id);
        const taskIds = tasks.data.map(task => task.task_id);
    
        const { data, error } = await supabaseClient
        .from('tasks')
        .select()
        .eq('project_id', project_id)
        .filter('id', 'in', taskIds)
    
        if (error) {
        throw new Error(error.message);
        }
    
        return data;
    }
    

}
