import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../models/event';
import { EventsService } from '../services/event/events.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.dogId = Number(this.route.snapshot.paramMap.get('id'));
    this.generateWeek();
    this.generateHours();
    this.loadDummyEvents();
    this.newEvent.dog = this.dogId 
  }

  dogId!: number;
  currentDate: Date = new Date();

  weekDays: Date[] = [];
  hours: number[] = [];

  events: Event[] = [];

  showAddEventForm: boolean = false;
  newEvent: Event = {
  title: '',
  description: '',
  place: '',
  startTime: new Date(),
  endTime: new Date(),
  dog: this.dogId
};

  selectedEvent: Event | null = null

  generateWeek() {
    const monday = this.getMonday(this.currentDate);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      this.weekDays.push(day);
    }
  }

  getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

   // ---------- HOURS ----------
  generateHours() {
    this.hours = Array.from({ length: 15 }, (_, i) => i + 6);
  }

  // ---------- NAVIGATION ----------
  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
  }

  // ---------- DUMMY EVENTS ----------
  loadDummyEvents() {
    this.events = this.eventsService.getEvents().filter(e => e.dog === this.dogId);
  }

getEventStyle(event: Event, day: Date) {
  const eventDate = new Date(event.startTime);
  
  if (eventDate.toDateString() !== day.toDateString()) return { display: 'none' };

  const hourHeight = 40; // match .hour-cell CSS height
  const startHour = eventDate.getHours();
  const startMinutes = eventDate.getMinutes();
  const top = (startHour - 6)  * hourHeight + (startMinutes / 60) * hourHeight;

  const endDate = new Date(event.endTime);
  const durationMinutes = ((endDate.getTime() - eventDate.getTime()) / (1000 * 60));
  const height = (durationMinutes / 60) * hourHeight;

  // Add small vertical offset per event index to avoid full overlap

  return {
    position: 'absolute',
    top: `${top}px`,
    left: '5px',
    right: '5px',
    height: `${height}px`,
    backgroundColor: '#0d6efd',
    color: 'white',
    borderRadius: '4px',
    padding: '2px 5px',
    fontSize: '12px',
    overflow: 'hidden'
  };
}

  openAddEventModal() {
      this.showAddEventForm = true;
    }

  closeAddEventModal() {
    this.showAddEventForm = false;
  }

  addEvent() {
    this.eventsService.push(this.newEvent);   
    this.newEvent = { title: '', description: '', place: '', startTime: new Date(), endTime: new Date(), dog: this.dogId };
    this.showAddEventForm = false;
  }

  openEventDetails(event: Event) {
    this.selectedEvent = event;
  }

  closeEventDetails() {
    this.selectedEvent = null;
  }
}
