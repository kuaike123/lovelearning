import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {QueueModule} from './queue/queue.module';
import {JobsController} from './jobs/jobs.controller';
import {JobsRepository} from './jobs/jobs.repository';
import {JobsService} from './jobs/jobs.service';

@Module({
  imports: [QueueModule],
  controllers: [AppController, JobsController],
  providers: [JobsService, JobsRepository]
})
export class AppModule {}
