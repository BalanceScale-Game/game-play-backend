import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable({})
export class TaskSchedulingService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, seconds: string, callback: () => void) {
    const job = new CronJob(`${seconds} * * * * *`, callback);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    return job;
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
    });
  }

  addInterval(name: string, milliseconds: number, callback: () => void) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }

  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
  }
  getIntervals() {
    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((key) => console.log(`Interval: ${key}`));
  }

  addTimeout(name: string, milliseconds: number, callback: () => void) {
    const timeout = setTimeout(() => {
      callback();
      this.deleteTimeout(name);
    }, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string) {
    this.schedulerRegistry.deleteTimeout(name);
  }

  getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => console.log(`Timeout: ${key}`));
  }
}
