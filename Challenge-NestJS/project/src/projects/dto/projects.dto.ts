import {
  IsString,
  IsNotEmpty,
  IsDateString
} from 'class-validator';
import { UserEntity } from 'src/users/entity/user.entity';


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

  @IsNotEmpty()
  @IsString()
  author: UserEntity;
}