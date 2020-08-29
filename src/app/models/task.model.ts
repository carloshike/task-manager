import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Status, StatusAdapter } from './status.model';

export class Task {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public statusId: string,
        public status: Status,
    ) { }
}

@Injectable({
    providedIn: 'root'
})

export class TaskAdapter implements Adapter<Task> {

  constructor(
    private statusAdapter: StatusAdapter
  ) { }

    adapt(item: any, statusList: Status[]): Task {
      return new Task(
        item.id,
        item.name,
        item.description,
        item.statusId,
        statusList ? statusList.find(s => s.id === item.statusId) : null
      );
    }
  }
