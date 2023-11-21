import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ServiceWmModule } from 'src/services/service-wm/service-wm.module';
import { AuthModule } from 'src/auth/auth.module';
import { Filters } from './helper/filters.heper';

@Module({
  controllers: [ReportController],
  providers: [ReportService, Filters],
  imports: [ServiceWmModule, AuthModule],
})
export class ReportModule { }
