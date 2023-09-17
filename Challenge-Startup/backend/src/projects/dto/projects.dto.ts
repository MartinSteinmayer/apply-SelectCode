import {
  IsString,
  IsNotEmpty,
} from 'class-validator';


export class ProjectsDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}