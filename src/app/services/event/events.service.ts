import { Injectable } from '@angular/core';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  private events: Event[] = [{
      title: 'Morning Walk',
      description: '30 minute walk around neighborhood',
      place: 'Home Park',
      startTime: new Date('2026-03-24T08:00'),
      endTime: new Date('2026-03-24T08:30'),
      dog: 1
    },
    {
      title: 'Training',
      description: 'basic commands',
      place: 'practice room',
      startTime: new Date('2026-03-24T10:00'),
      endTime: new Date('2026-03-24T12:00'),
      dog: 1
    },
    {
      title: 'Morning Walk',
      description: '30 minute walk around neighborhood',
      place: 'Home Park',
      startTime: new Date('2026-03-26T08:00'),
      endTime: new Date('2026-03-26T08:30'),
      dog: 1
    }
  ]

  getEvents(): Event[] {
    return this.events;
  }

  push(newEvent: Event)  {
    this.events.push(newEvent);
  }
      
}
