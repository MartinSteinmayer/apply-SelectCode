import { IsNumber, IsString } from 'class-validator';

export class UsersDto {
    @IsString()
    username: string;

    @IsNumber()
    id: number;

    @IsString()
    password: string;
}
