import {Module} from '@nestjs/common';

import {QueueModule} from './queue/queue.module';
import {JobsController} from './jobs/jobs.controller';
import {JobsRepository} from './jobs/jobs.repository';
import {JobsService} from './jobs/jobs.service';

@Module({
  imports: [QueueModule],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository]
})
export class AppModule {}
