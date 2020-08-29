import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Task, TaskAdapter } from './task.model';
import { Status, StatusAdapter } from './status.model';

export class List {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public tasks: Task[],
        public status: Status[],
    ) { }
}

@Injectable({
    providedIn: 'root'
})

export class ListAdapter implements Adapter<List> {

    constructor(
      private taskAdapter: TaskAdapter,
      private statusAdapter: StatusAdapter
    ) { }

    adapt(item: any): List {
      return new List(
        item.id,
        item.name,
        item.description,
        item.tasks ? item.tasks.sort().reverse().map(task => this.taskAdapter.adapt(task, item.status)) : [],
        item.status ? item.status.map(status => this.statusAdapter.adapt(status)) : []
      );
    }
  }
