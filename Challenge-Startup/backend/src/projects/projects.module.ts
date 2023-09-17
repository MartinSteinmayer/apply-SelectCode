import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}