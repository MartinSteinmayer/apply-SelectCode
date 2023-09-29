import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
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
      console.log(error);
      return { success: false, message: error.message };
    }

    this.logger.log(`User ${email} signed up`);
    return { success: true, data };
  }

  @UseGuards(SupabaseGuard)
  @Post('insertProfile')
  async insertProfile(@Body() profileDto : {id: string, email: string}, @Request() req) {
    console.log(req.headers);
    console.log(profileDto.email);
    console.log(profileDto.id);
    const supabaseClient = await this.supabaseService.getClient();
    const user = {
      id: profileDto.id,
      email: profileDto.email,
    }

    const registeredProfiles = await supabaseClient.from('profiles').select().eq('id', profileDto.id);

    if (registeredProfiles.count > 0) {
      return { success: false, message: 'Profile already exists' };
    }

    const { error } = await supabaseClient.from('profiles').insert([user]);
    if (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Profile created successfully' };
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
    this.logger.log(`User ${email} logged in`);
    return { success: true, data };
  }

  @UseGuards(SupabaseGuard)
  @Post('logout')
  async logout(@Request() req) {
    const supabaseClient = await this.supabaseService.getClient();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Logged out successfully' };
  }

  @UseGuards(SupabaseGuard)
  @Get("user")
  async getUser(@Request() req) {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient
      .from('profiles')
      .select()
      .eq('id', req.user.sub);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  }
}
