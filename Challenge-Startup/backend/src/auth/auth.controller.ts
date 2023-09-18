import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { Logger } from '@nestjs/common';
import { SupabaseGuard } from '../supabase/guard/supabase.guard';



@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const supabaseClient = await this.supabaseService.getClient();
    const { email, password } = signupDto;
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
    });
    
    if (error) {
      return { success: false, message: error.message };
    }

    await supabaseClient.from('profiles').insert([{ id: data.user.id, email: email }]);

    this.logger.log(`User ${email} signed up`);
    return { success: true, data };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const supabaseClient = await this.supabaseService.getClient();
    const { email, password } = loginDto;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  }

  @UseGuards(SupabaseGuard)
  @Post('logout')
  async logout() {
    const supabaseClient = await this.supabaseService.getClient();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Logged out successfully' };
  }
}
