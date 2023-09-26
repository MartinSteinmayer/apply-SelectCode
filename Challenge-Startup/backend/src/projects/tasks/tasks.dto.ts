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
    @IsString()
    status: string;
  }