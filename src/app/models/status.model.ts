import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Status {
    constructor(
        public id: string,
        public name: string,
        public color: string,
    ) { }
}

@Injectable({
    providedIn: 'root'
})

export class StatusAdapter implements Adapter<Status> {

    adapt(item: any): Status {
      return new Status(
        item.id,
        item.name,
        item.color
      );
    }
  }
