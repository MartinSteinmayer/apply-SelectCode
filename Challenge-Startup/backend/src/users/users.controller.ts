import {
    Controller,
    UseGuards,
    Get,
    Param,
  } from '@nestjs/common';
import { SupabaseGuard } from '../supabase/guard/supabase.guard';
import { UsersService } from './users.service';
  
  @Controller('users')
  export class UsersController {
    private readonly usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    @UseGuards(SupabaseGuard)
    @Get('/:user_id')
    async getUser(@Param('user_id') userId) {
      return this.usersService.getUser(userId);
    }
  }