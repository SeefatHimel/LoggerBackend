import { Module } from '@nestjs/common';
import { WorklogService } from './worklog.service';
import { WorklogController } from './worklog.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  controllers: [WorklogController],
  providers: [WorklogService],
})
export class WorklogModule {}
