import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.find(id);
  }
}
