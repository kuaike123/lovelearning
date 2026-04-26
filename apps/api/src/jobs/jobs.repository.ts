import {Injectable} from '@nestjs/common';

@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, {jobId: string; status: string; [key: string]: unknown}>();

  save(job: {jobId: string; status: string; [key: string]: unknown}) {
    this.jobs.set(job.jobId, job);
    return job;
  }

  update(jobId: string, patch: Record<string, unknown>) {
    const current = this.findById(jobId);
    if (!current) return null;

    const next = {...current, ...patch};
    this.jobs.set(jobId, next);
    return next;
  }

  findById(jobId: string) {
    return this.jobs.get(jobId) ?? null;
  }

  listRecent(limit = 20) {
    return Array.from(this.jobs.values()).reverse().slice(0, limit);
  }
}
