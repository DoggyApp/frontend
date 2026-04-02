import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../models/event';
import { EventsService } from '../services/event/events.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    standalone: false
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
    this.loadEvents();
  }

  dogId!: number;
  currentDate: Date = new Date();
  weekDays: Date[] = [];
  hours: number[] = [];
  events: Event[] = [];
  showAddEventForm = false;
  selectedEvent: Event | null = null;

  newEvent: Partial<Event> = {
    event: '',
    description: '',
    place: '',
    startTime: '',
    endTime: '',
    trainers: [],
    dogs: []
  };

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

  generateHours() {
    this.hours = Array.from({ length: 15 }, (_, i) => i + 6);
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
  }

  loadEvents() {
    this.eventsService.getEventsByDog(this.dogId).subscribe(events => {
      this.events = events;
    });
  }

  getEventStyle(event: Event, day: Date) {
    const eventDate = new Date(event.startTime);
    if (eventDate.toDateString() !== day.toDateString()) return { display: 'none' };

    const hourHeight = 40;
    const top = (eventDate.getHours() - 6) * hourHeight + (eventDate.getMinutes() / 60) * hourHeight;
    const endDate = new Date(event.endTime);
    const height = ((endDate.getTime() - eventDate.getTime()) / (1000 * 60) / 60) * hourHeight;

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

  openAddEventModal() { this.showAddEventForm = true; }

  closeAddEventModal() { this.showAddEventForm = false; }

  addEvent() {
    this.eventsService.createEvent(this.newEvent, this.dogId).subscribe(savedEvent => {
      this.events.push(savedEvent);
      this.newEvent = { event: '', description: '', place: '', startTime: '', endTime: '', trainers: [], dogs: [] };
      this.showAddEventForm = false;
    });
  }

  openEventDetails(event: Event) { this.selectedEvent = event; }

  closeEventDetails() { this.selectedEvent = null; }

}
