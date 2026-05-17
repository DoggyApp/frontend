import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-calendar',
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.css'],
  standalone: false
})
export class UserCalendarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  currentUser: User | null = null;
  events: CalendarEvent[] = [];
  rooms: Room[] = [];
  allDogs: Dog[] = [];
  allUsers: User[] = [];

  currentDate = new Date();
  weekDays: Date[] = [];
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 6);

  // Create form
  showAddEventForm = false;
  newEvent: Partial<CalendarEvent> = {};
  selectedDogs: Dog[] = [];
  dogSearch = '';
  filteredDogs: Dog[] = [];

  // Event detail popup
  selectedEvent: CalendarEvent | null = null;
  isCreator = false;

  // Edit within popup
  showEditForm = false;
  editForm: Partial<CalendarEvent> = {};

  // Add dog in popup
  popupDogSearch = '';
  popupFilteredDogs: Dog[] = [];

  ngOnInit(): void {
    this.userService.getSession().subscribe(user => {
      if (!user) { this.router.navigate(['/user-login']); return; }
      this.currentUser = user;
      this.loadEvents();
    });
    this.generateWeek();
    this.userService.getRooms().subscribe(rooms => this.rooms = rooms);
    this.userService.getDogs().subscribe(dogs => this.allDogs = dogs);
  }

  loadEvents(): void {
    if (!this.currentUser) return;
    this.userService.getMyEvents().subscribe(events => {
      this.events = events;
    });
  }

  // ── Week grid ──────────────────────────────────────────

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

  nextWeek(): void { this.currentDate.setDate(this.currentDate.getDate() + 7); this.generateWeek(); }
  previousWeek(): void { this.currentDate.setDate(this.currentDate.getDate() - 7); this.generateWeek(); }

  getEventStyle(event: CalendarEvent, day: Date): Record<string, string> {
    const start = new Date(event.startTime);
    if (start.toDateString() !== day.toDateString()) return { display: 'none' };
    const hourH = 40;
    const top = (start.getHours() - 6) * hourH + (start.getMinutes() / 60) * hourH;
    const end = new Date(event.endTime);
    const height = Math.max(((end.getTime() - start.getTime()) / 3600000) * hourH, 20);
    const mine = this.currentUser && event.userCreator?.id === this.currentUser.id;
    return {
      position: 'absolute', top: `${top}px`, left: '2px', right: '2px',
      height: `${height}px`, backgroundColor: mine ? '#198754' : '#0d6efd',
      color: 'white', borderRadius: '4px', padding: '2px 4px',
      fontSize: '11px', overflow: 'hidden', cursor: 'pointer', zIndex: '1'
    };
  }

  // ── Create event ───────────────────────────────────────

  openAddEventForm(): void {
    this.newEvent = { event: '', description: '', room: undefined, startTime: '', endTime: '' };
    this.selectedDogs = [];
    this.dogSearch = '';
    this.filteredDogs = [];
    this.showAddEventForm = true;
  }

  closeAddEventForm(): void { this.showAddEventForm = false; }

  onDogSearch(): void {
    const q = this.dogSearch.toLowerCase();
    this.filteredDogs = q
      ? this.allDogs.filter(d =>
          d.name.toLowerCase().includes(q) && !this.selectedDogs.some(s => s.id === d.id))
      : [];
  }

  addDogToForm(dog: Dog): void {
    this.selectedDogs.push(dog);
    this.dogSearch = '';
    this.filteredDogs = [];
  }

  removeDogFromForm(dogId: number): void {
    this.selectedDogs = this.selectedDogs.filter(d => d.id !== dogId);
  }

  submitAddEvent(): void {
    this.userService.createEvent(this.newEvent).subscribe(created => {
      const ops = this.selectedDogs.map(d => this.userService.addDogToEvent(created.id, d.id));
      if (ops.length === 0) {
        this.loadEvents();
        this.closeAddEventForm();
      } else {
        forkJoin(ops).subscribe(() => {
          this.loadEvents();
          this.closeAddEventForm();
        });
      }
    });
  }

  // ── Event detail popup ────────────────────────────────

  openEventDetails(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.isCreator = !!this.currentUser && event.userCreator?.id === this.currentUser.id;
    this.showEditForm = false;
    this.popupDogSearch = '';
    this.popupFilteredDogs = [];
  }

  closeEventDetails(): void { this.selectedEvent = null; this.showEditForm = false; }

  isAlreadyJoined(): boolean {
    return !!this.currentUser &&
      (this.selectedEvent?.userAttendees ?? []).some(t => t.id === this.currentUser!.id);
  }

  joinEvent(): void {
    if (!this.selectedEvent) return;
    this.userService.joinEvent(this.selectedEvent.id).subscribe();
  }

  // ── Edit ──────────────────────────────────────────────

  openEditForm(): void {
    if (!this.selectedEvent) return;
    this.editForm = {
      event: this.selectedEvent.event,
      description: this.selectedEvent.description,
      room: this.selectedEvent.room,
      startTime: this.selectedEvent.startTime,
      endTime: this.selectedEvent.endTime
    };
    this.showEditForm = true;
  }

  closeEditForm(): void { this.showEditForm = false; }

  submitEdit(): void {
    if (!this.selectedEvent) return;
    this.userService.editEvent(this.selectedEvent.id, this.editForm).subscribe(updated => {
      this.replaceEvent(updated);
      this.selectedEvent = updated;
      this.showEditForm = false;
    });
  }

  // ── Add dog in popup ──────────────────────────────────

  onPopupDogSearch(): void {
    const q = this.popupDogSearch.toLowerCase();
    this.popupFilteredDogs = q
      ? this.allDogs.filter(d =>
          d.name.toLowerCase().includes(q) &&
          !this.selectedEvent?.dogs.some(ed => ed.id === d.id))
      : [];
  }

  addDogToEvent(dog: Dog): void {
    if (!this.selectedEvent) return;
    this.userService.addDogToEvent(this.selectedEvent.id, dog.id).subscribe(() => {
      this.popupDogSearch = '';
      this.popupFilteredDogs = [];
    });
  }

  // ── Delete ────────────────────────────────────────────

  deleteEvent(): void {
    if (!this.selectedEvent) return;
    this.userService.deleteEvent(this.selectedEvent.id).subscribe(() => {
      this.events = this.events.filter(e => e.id !== this.selectedEvent!.id);
      this.closeEventDetails();
    });
  }

  private replaceEvent(updated: CalendarEvent): void {
    const i = this.events.findIndex(e => e.id === updated.id);
    if (i !== -1) this.events[i] = updated;
  }
}
