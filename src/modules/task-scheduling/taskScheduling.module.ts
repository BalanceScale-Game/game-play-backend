import { Module } from '@nestjs/common';
import { TaskSchedulingService } from './taskScheduling.service';

@Module({
  providers: [TaskSchedulingService],
  exports: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
