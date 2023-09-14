import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto/users.dto';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get('/')
    async findAll(): Promise<UserEntity[]> {
        return this.usersService.findAll();
    }
    
    @Post('/')
    async create(@Body() user : UsersDto) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
        const newUser = { ...user, password: hashedPassword };
        const result = await this.usersService.createUser(newUser);
        return {
            msg: 'User successfully registered',
            id: result.id,
            username: result.username
          };
    }

    @Get('/:id')
    async findByIdOrUsername(@Param('id') id: string): Promise<UserEntity | null> {
        if (Number.isNaN(Number(id))) {
            return this.usersService.findByUsername(id);
        }
        return this.usersService.findById(Number(id));
    }

    @Delete('/:id')
    async deleteByIdOrUsername(@Param('id') id: string): Promise<UserEntity | null> {
        if (Number.isNaN(Number(id))) {
            return this.usersService.deleteByUsername(id);
        }
        return this.usersService.deleteById(Number(id));
    }


}
