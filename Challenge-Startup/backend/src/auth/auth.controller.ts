import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthService } from './auth.service';
import { UsersDto } from '../users/dto/users.dto/users.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/')
  signIn(@Body() signInDto: UsersDto) {
    const result = this.authService.validateUser(
      signInDto.username,
      signInDto.password,
    );


    if (result) {
      return {...result, msg: 'You are logged in'};
    } else {
      return { msg: 'Wrong username or password' };
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req): any {
    return { User: req.user, msg: 'Current user profile' };
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
