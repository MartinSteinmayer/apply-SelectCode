import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/client')
  async getClient(): Promise<any> {
    const supabaseClient = await this.supabaseService.getClient();

    const { data, error } = await supabaseClient
      .from('products')
      .select()
      .single();

    console.log(data);
    return data;
  }
}
