import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto/users.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get('/')
    findAll(): UsersDto[] {
        return this.usersService.findAll();
    }
    
    @Post('/')
    create(@Body() user : UsersDto): UsersDto {
        return this.usersService.create(user);
    }
}
