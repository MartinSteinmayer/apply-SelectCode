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
  constructor(
    private readonly supabaseService: SupabaseService,
    private mailService: MailService,
  ) {}

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

  async findOne(id: number): Promise<Project> {
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
      .eq('id', id);

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
      .eq('id', id);

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
      .eq('project_id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createTask(project_id: number, task: TasksDto, userId: string) {
    const supabaseClient = await this.supabaseService.getClient();

    const project: Project = await this.findOne(project_id);

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

    const { error } = await supabaseClient.from('tasks').insert([newTask]);

    const { data } = await supabaseClient
      .from('tasks')
      .select()
      .eq('title', task.title)
      .gte('created_at', new Date().toISOString())
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async assignTask(
    project_id: number,
    task_id: number,
    assignTaskDto: { user_email: string },
    userId: string,
  ) {
    const supabaseClient = await this.supabaseService.getClient();

    const user = await supabaseClient
      .from('profiles')
      .select()
      .eq('email', assignTaskDto.user_email);

    const task = await this.getTask(task_id);

    const project: Project = await this.findOne(project_id);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.owner_id !== userId) {
      throw new Error('You are not the owner of this project');
    }

    const { error } = await supabaseClient
      .from('task_assignments')
      .insert([{ task_id: task_id, user_id: user.data[0].id }]);

    if (error) {
      throw new Error(error.message);
    }

    // Functioniert nicht mehr wegen sendgrid authentication
    // await this.mailService.sendEmail(assignTaskDto.user_email);

    return task;
  }

  async unassignTask(
    project_id: number,
    task_id: number,
    assignTaskDto: { user_email: string },
    userId: string,
  ) {
    const supabaseClient = await this.supabaseService.getClient();
    const user = await supabaseClient
      .from('profiles')
      .select()
      .eq('email', assignTaskDto.user_email);
    const task = await this.getTask(task_id);

    const project: Project = await this.findOne(project_id);
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

  async getTask(task_id: number) {
    const supabaseClient = await this.supabaseService.getClient();

    const { data, error } = await supabaseClient
      .from('tasks')
      .select()
      .eq('id', task_id);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      throw new Error('Task not found');
    }

    return data[0];
  }

  async updateTask(
    project_id: number,
    task_id: number,
    task: TasksDto,
    userId: string,
  ) {
    const supabaseClient = await this.supabaseService.getClient();

    const project: Project = await this.findOne(project_id);
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

    console.log(task_id);

    const { error } = await supabaseClient
      .from('tasks')
      .update(newTask)
      .eq('id', task_id);

    if (error) {
      throw new Error(error.message);
    }

    return newTask;
  }

  async deleteTask(project_id: number, task_id: number, userId: string) {
    const supabaseClient = await this.supabaseService.getClient();

    const project: Project = await this.findOne(project_id);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.owner_id !== userId) {
      throw new Error('You are not the owner of this project');
    }

    const task = await this.getTask(task_id);
    const { error } = await supabaseClient
      .from('tasks')
      .delete()
      .eq('id', task_id);

    if (error) {
      throw new Error(error.message);
    }

    return task;
  }

  async updateTaskStatus(task_id: number, status: string) {
    const supabaseClient = await this.supabaseService.getClient();

    const { error } = await supabaseClient
      .from('tasks')
      .update({ status: status })
      .eq('id', task_id);

    if (error) {
      throw new Error(error.message);
    }

    return status;
  }

  async getTasksFromUser(userID: string) {
    const supabaseClient = await this.supabaseService.getClient();
    const tasks = await supabaseClient
      .from('task_assignments')
      .select()
      .eq('user_id', userID);

    if (tasks.data.length === 0) {
      return [];
    }
    const taskIds = tasks.data.map((task) => task.task_id);

    if (!taskIds.length) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from('tasks')
      .select()
      .in('id', taskIds);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getTasksFromUserAndProject(project_id: number, userEmail: string) {
    const supabaseClient = await this.supabaseService.getClient();
    const user = await supabaseClient
      .from('profiles')
      .select()
      .eq('email', userEmail)
      .single();
    const tasks = await supabaseClient
      .from('task_assignments')
      .select()
      .eq('user_id', user.data.id);
    const taskIds = tasks.data.map((task) => task.task_id);

    const { data, error } = await supabaseClient
      .from('tasks')
      .select()
      .eq('project_id', project_id)
      .in('id', taskIds);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUsersFromProject(project_id: number) {
    const supabaseClient = await this.supabaseService.getClient();
    const tasks = await this.getTasks(project_id);

    const taskIds = tasks.map((task) => task.id);
    const taskAssignments = await supabaseClient
      .from('task_assignments')
      .select()
      .in('task_id', taskIds);
    const userIds = taskAssignments.data.map((task) => task.user_id);

    const { data, error } = await supabaseClient
      .from('profiles')
      .select()
      .in('id', userIds);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getAssigneesFromTask(task_id: number) {
    const supabaseClient = await this.supabaseService.getClient();
    const taskAssignments = await supabaseClient
      .from('task_assignments')
      .select()
      .eq('task_id', task_id);
    const userIds = taskAssignments.data.map((task) => task.user_id);

    const { data, error } = await supabaseClient
      .from('profiles')
      .select()
      .in('id', userIds);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getCommentsFromTask(task_id: number) {
    const supabaseClient = await this.supabaseService.getClient();

    const { data, error } = await supabaseClient
      .from('task_comments')
      .select()
      .eq('task_id', task_id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createComment(
    task_id: number,
    comment: { comment: string },
    userId: string,
  ) {
    const supabaseClient = await this.supabaseService.getClient();

    const newComment = {
      ...comment,
      task_id: task_id,
      user_id: userId,
    };

    const { error } = await supabaseClient
      .from('task_comments')
      .insert([newComment]);

    if (error) {
      throw new Error(error.message);
    }

    return newComment;
  }
}
