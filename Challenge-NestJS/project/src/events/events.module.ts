import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { EventsService } from './events.service';
@Module({
  imports: [],
  controllers: [],
  providers: [EventsService],
  exports: [EventsService],
})

export class EventsModule {}
