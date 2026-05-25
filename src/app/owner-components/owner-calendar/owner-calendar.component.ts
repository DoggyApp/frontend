import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent } from '../../models/event';
import { Owner } from '../../models/owner';
import { Dog } from '../../models/dog';
import { EventInvitation } from '../../models/event-invitation';
import { OwnerService } from '../../services/owner/owner.service';

export interface CalendarItem {
  type: 'event' | 'invitation';
  time: Date;
  event?: CalendarEvent;
  invitation?: EventInvitation;
}

@Component({
  selector: 'app-owner-calendar',
  templateUrl: './owner-calendar.component.html',
  styleUrls: ['./owner-calendar.component.css'],
  standalone: false
})
export class OwnerCalendarComponent implements OnInit {

  events: CalendarEvent[] = [];
  invitations: EventInvitation[] = [];
  currentOwner: Owner | null = null;
  loading = true;

  showCreateModal = false;
  selectedEvent: CalendarEvent | null = null;
  selectedInvitation: EventInvitation | null = null;

  get calendarItems(): CalendarItem[] {
    const eventItems: CalendarItem[] = this.events.map(ev => ({
      type: 'event',
      time: new Date(ev.startTime),
      event: ev
    }));
    const inviteItems: CalendarItem[] = this.invitations.map(inv => ({
      type: 'invitation',
      time: new Date(inv.event.startTime),
      invitation: inv
    }));
    return [...eventItems, ...inviteItems].sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  get ownerDogs(): Dog[] {
    return this.currentOwner?.dogs ?? [];
  }

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/']);
        return;
      }
      this.currentOwner = owner;
    });

    this.loadEvents();
    this.loadInvitations();
  }

  loadEvents(): void {
    this.ownerService.getMyEvents().subscribe(events => {
      this.events = events.sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      this.loading = false;
    });
  }

  loadInvitations(): void {
    this.ownerService.getInvitations().subscribe(invitations => {
      this.invitations = invitations;
    });
  }

  isMyEvent(ev: CalendarEvent): boolean {
    return !!this.currentOwner && ev.ownerCreator?.id === this.currentOwner.id;
  }

  onEventCreated(): void {
    this.showCreateModal = false;
    this.loadEvents();
  }

  openEvent(ev: CalendarEvent): void {
    this.selectedEvent = ev;
  }

  onEventUpdated(updated: CalendarEvent): void {
    this.events = this.events.map(e => e.id === updated.id ? updated : e);
    this.selectedEvent = updated;
  }

  onEventDeleted(id: number): void {
    this.events = this.events.filter(e => e.id !== id);
    this.selectedEvent = null;
  }

  openInvitation(inv: EventInvitation): void {
    this.selectedInvitation = inv;
  }

  closeInvitation(): void {
    this.selectedInvitation = null;
  }

  acceptInvitation(inv: EventInvitation): void {
    this.ownerService.acceptInvitation(inv.id).subscribe(() => {
      this.invitations = this.invitations.filter(i => i.id !== inv.id);
      this.closeInvitation();
      this.loadEvents();
    });
  }

  declineInvitation(inv: EventInvitation): void {
    this.ownerService.declineInvitation(inv.id).subscribe(() => {
      this.invitations = this.invitations.filter(i => i.id !== inv.id);
      this.closeInvitation();
    });
  }
}
