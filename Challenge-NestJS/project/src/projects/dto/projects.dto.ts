import {
  IsString,
  IsNotEmpty,
  IsDateString
} from 'class-validator';


export class ProjectsDto {

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