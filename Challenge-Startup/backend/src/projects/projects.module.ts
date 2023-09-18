import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { MailModule } from 'src/mail/mail.module';
@Module({
    imports: [SupabaseModule, MailModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}