import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsArray
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
  }