import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent } from '../models/event';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-calendar',
  templateUrl: './owner-calendar.component.html',
  styleUrls: ['./owner-calendar.component.css'],
  standalone: false
})
export class OwnerCalendarComponent implements OnInit {

  events: CalendarEvent[] = [];
  loading = true;

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/owner-login']);
        return;
      }
    });

    this.ownerService.getMyEvents().subscribe(events => {
      this.events = events.sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      this.loading = false;
    });
  }
}
