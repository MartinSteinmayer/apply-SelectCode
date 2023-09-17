import {
    IsString,
    IsNotEmpty,
    IsEnum
  } from 'class-validator';
  
  
  export class TasksDto {
  
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(['todo', 'in_progress', 'done'])
    status: string;

    @IsNotEmpty()
    @IsString()
    assigned_to: string;
  }