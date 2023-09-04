import {
  IsAlphanumeric,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { OneToMany } from 'typeorm';
import { ProjectsDto } from '../../../projects/dto/projects.dto';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class UsersDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @IsNotEmpty()
  @OneToMany(() => ProjectsDto, (project: ProjectsDto) => project.name)
  projects: ProjectsDto[];
}