import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [ServiceService],
  imports: [CommonModule]
})
export class ServiceModule { }
