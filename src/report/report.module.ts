import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [CommonModule],
})
export class ReportModule { }
