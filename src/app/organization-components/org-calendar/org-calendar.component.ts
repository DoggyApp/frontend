import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent } from '../../models/event';
import { Location } from '../../models/location';
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-org-calendar',
  templateUrl: './org-calendar.component.html',
  styleUrls: ['./org-calendar.component.css'],
  standalone: false
})
export class OrgCalendarComponent implements OnInit {

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  locations: Location[] = [];
  selectedLocationId: number | null = null;
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;

  currentDate = new Date();
  weekDays: Date[] = [];
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 6);

  ngOnInit(): void {
    this.organizationService.getSession().subscribe(org => {
      if (!org) { this.router.navigate(['/org-login']); return; }
    });
    this.generateWeek();
    this.organizationService.getLocations().subscribe(locs => {
      this.locations = locs;
      if (locs.length > 0) {
        this.selectedLocationId = locs[0].id;
        this.loadEvents();
      }
    });
  }

  onLocationChange(): void {
    this.events = [];
    this.loadEvents();
  }

  loadEvents(): void {
    if (this.selectedLocationId == null) return;
    this.organizationService.getEventsByLocation(this.selectedLocationId).subscribe(events => {
      this.events = events;
    });
  }

  generateWeek(): void {
    const monday = this.getMonday(this.currentDate);
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    return d;
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
  }

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
  }

  getEventStyle(event: CalendarEvent, day: Date): Record<string, string> {
    const start = new Date(event.startTime);
    if (start.toDateString() !== day.toDateString()) return { display: 'none' };
    const hourH = 40;
    const top = (start.getHours() - 6) * hourH + (start.getMinutes() / 60) * hourH;
    const end = new Date(event.endTime);
    const height = Math.max(((end.getTime() - start.getTime()) / 3600000) * hourH, 20);
    return {
      position: 'absolute', top: `${top}px`, left: '2px', right: '2px',
      height: `${height}px`, backgroundColor: '#0d6efd', color: 'white',
      borderRadius: '4px', padding: '2px 4px', fontSize: '11px',
      overflow: 'hidden', cursor: 'pointer', zIndex: '1'
    };
  }

  openEventDetails(event: CalendarEvent): void { this.selectedEvent = event; }
  closeEventDetails(): void { this.selectedEvent = null; }
}
