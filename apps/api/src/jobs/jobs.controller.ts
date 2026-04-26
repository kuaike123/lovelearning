import {Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post} from '@nestjs/common';

import {JobsService} from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(@Inject(JobsService) private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.jobsService.create(body);
  }

  @Get()
  list() {
    return this.jobsService.list();
  }

  @Post(':id/regenerate')
  regenerate(@Param('id') id: string) {
    const job = this.jobsService.regenerate(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.find(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
