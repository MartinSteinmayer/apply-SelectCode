import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseGuard } from './supabase/guard/supabase.guard';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    SupabaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
    AppService,
  ],
})
export class AppModule {}
