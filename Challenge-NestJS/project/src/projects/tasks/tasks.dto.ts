import {
    IsString,
    IsNotEmpty,
    IsDateString
  } from 'class-validator';
  
  
  export class TasksDto {
  
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsString()
    @IsDateString()
    createdDate: string;
  }