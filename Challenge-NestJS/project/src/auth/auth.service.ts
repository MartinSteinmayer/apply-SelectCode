import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!user) {
        console.log('could not find the user');
        throw new UnauthorizedException('could not find the user');
      }
    if (user && passwordValid) {
      return {
        userId: user.id,
        userName: user.username
      };
    }
    console.log('wrong password');
    return null;
  }
}