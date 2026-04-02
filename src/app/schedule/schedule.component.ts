import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../models/event';
import { Location } from '../models/location';
import { Dog } from '../models/dog';
import { User } from '../models/user';
import { EventsService } from '../services/event/events.service';
import { LocationService } from '../services/location/location.service';
import { DogService } from '../services/dog/dog.service';
import { UserService } from '../services/user/user.service';
import { OrganizationService } from '../services/organization/organization.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  constructor(
    private eventsService: EventsService,
    private locationService: LocationService,
    private dogService: DogService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private router: Router
  ) { }

  // ── Session ────────────────────────────────────────────
  isOrgSession = false;
  isUserSession = false;
  currentUser: User | null = null;

  // ── Mode ───────────────────────────────────────────────
  mode: 'dog' | 'location' = 'dog';

  // ── Dogs ───────────────────────────────────────────────
  allDogs: Dog[] = [];
  filteredDogs: Dog[] = [];
  dogSearch = '';
  selectedDog: Dog | null = null;

  // ── Locations ──────────────────────────────────────────
  allLocations: Location[] = [];
  filteredLocations: Location[] = [];
  locationSearch = '';
  selectedLocation: Location | null = null;
  showAddLocationForm = false;
  newLocationName = '';

  // ── Calendar ───────────────────────────────────────────
  currentDate = new Date();
  weekDays: Date[] = [];
  hours: number[] = [];
  events: Event[] = [];

  // ── Add Event ──────────────────────────────────────────
  showAddEventForm = false;
  newEvent: Partial<Event> = {};
  selectedDogId: number | null = null;

  // ── Event Detail ───────────────────────────────────────
  selectedEvent: Event | null = null;
  addDogId: number | null = null;

  // ── Edit Event ─────────────────────────────────────────
  showEditForm = false;
  editForm: Partial<Event> = {};

  ngOnInit(): void {
    this.generateWeek();
    this.generateHours();

    this.organizationService.getSession().subscribe(org => {
      if (org) {
        this.isOrgSession = true;
      } else {
        this.userService.getSession().subscribe(user => {
          if (!user) { this.router.navigate(['/']); return; }
          this.isUserSession = true;
          this.currentUser = user;
        });
      }

      // Load dogs — accessible to both sessions via resolveOrgId
      this.dogService.getDogs().subscribe(dogs => {
        this.allDogs = dogs;
        this.filteredDogs = dogs;
      });

      // Load locations — org-only on backend; gracefully skip if user session
      this.locationService.getLocations().subscribe({
        next: locations => {
          this.allLocations = locations;
          this.filteredLocations = locations;
        },
        error: () => { /* User sessions may not have access */ }
      });
    });
  }

  // ── Mode switching ─────────────────────────────────────
  setMode(mode: 'dog' | 'location') {
    this.mode = mode;
    this.events = [];
    this.selectedDog = null;
    this.selectedLocation = null;
    this.dogSearch = '';
    this.locationSearch = '';
    this.filteredDogs = [...this.allDogs];
    this.filteredLocations = [...this.allLocations];
  }

  // ── Dog search & select ────────────────────────────────
  onDogSearch() {
    const q = this.dogSearch.toLowerCase();
    this.filteredDogs = this.allDogs.filter(d => d.name.toLowerCase().includes(q));
  }

  selectDog(dog: Dog) {
    this.selectedDog = dog;
    this.eventsService.getEventsByDog(dog.id).subscribe(events => {
      this.events = events;
    });
  }

  // ── Location search & select ───────────────────────────
  onLocationSearch() {
    const q = this.locationSearch.toLowerCase();
    this.filteredLocations = this.allLocations.filter(l => l.name.toLowerCase().includes(q));
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    this.eventsService.getEventsByLocation(location.id).subscribe(events => {
      this.events = events;
    });
  }

  // ── Calendar ───────────────────────────────────────────
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
    const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  generateHours() {
    this.hours = Array.from({ length: 15 }, (_, i) => i + 6);
  }

  nextWeek() { this.currentDate.setDate(this.currentDate.getDate() + 7); this.generateWeek(); }
  previousWeek() { this.currentDate.setDate(this.currentDate.getDate() - 7); this.generateWeek(); }

  getEventStyle(event: Event, day: Date) {
    const start = new Date(event.startTime);
    if (start.toDateString() !== day.toDateString()) return { display: 'none' };

    const hourHeight = 40;
    const top = (start.getHours() - 6) * hourHeight + (start.getMinutes() / 60) * hourHeight;
    const end = new Date(event.endTime);
    const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * hourHeight;
    const isOwn = this.currentUser && event.creator?.id === this.currentUser.id;

    return {
      position: 'absolute',
      top: `${top}px`,
      left: '5px',
      right: '5px',
      height: `${Math.max(height, 20)}px`,
      backgroundColor: isOwn ? '#198754' : '#0d6efd',
      color: 'white',
      borderRadius: '4px',
      padding: '2px 5px',
      fontSize: '12px',
      overflow: 'hidden',
      cursor: 'pointer'
    };
  }

  // ── Location management (org only) ────────────────────
  openAddLocationForm() { this.newLocationName = ''; this.showAddLocationForm = true; }
  closeAddLocationForm() { this.showAddLocationForm = false; }

  submitAddLocation() {
    if (!this.newLocationName.trim()) return;
    this.locationService.addLocation(this.newLocationName.trim()).subscribe(location => {
      this.allLocations.push(location);
      this.filteredLocations = [...this.allLocations];
      this.showAddLocationForm = false;
      this.selectLocation(location);
    });
  }

  deleteSelectedLocation() {
    if (!this.selectedLocation) return;
    this.locationService.deleteLocation(this.selectedLocation.id).subscribe(() => {
      this.allLocations = this.allLocations.filter(l => l.id !== this.selectedLocation!.id);
      this.filteredLocations = [...this.allLocations];
      this.selectedLocation = this.allLocations.length > 0 ? this.allLocations[0] : null;
      if (this.selectedLocation) this.selectLocation(this.selectedLocation);
      else this.events = [];
    });
  }

  // ── Add Event (user only) ─────────────────────────────
  openAddEventForm() {
    this.newEvent = {
      event: '',
      description: '',
      startTime: '',
      endTime: '',
      place: this.mode === 'location' ? (this.selectedLocation?.name ?? '') : ''
    };
    this.selectedDogId = this.mode === 'dog' && this.selectedDog ? this.selectedDog.id : null;
    this.showAddEventForm = true;
  }

  closeAddEventForm() { this.showAddEventForm = false; }

  submitAddEvent() {
    if (!this.selectedDogId) return;
    this.eventsService.createEvent(this.newEvent, this.selectedDogId).subscribe(created => {
      this.events.push(created);
      this.showAddEventForm = false;
    });
  }

  // ── Event Detail ──────────────────────────────────────
  openEventDetails(event: Event) {
    this.selectedEvent = event;
    this.addDogId = null;
    this.showEditForm = false;
  }

  closeEventDetails() { this.selectedEvent = null; this.showEditForm = false; }

  isCurrentUserCreator(): boolean {
    return !!this.currentUser && this.selectedEvent?.creator?.id === this.currentUser.id;
  }

  isAlreadyJoined(): boolean {
    return !!this.currentUser && (this.selectedEvent?.trainers ?? []).some(t => t.id === this.currentUser!.id);
  }

  joinEvent() {
    if (!this.selectedEvent) return;
    this.eventsService.joinEvent(this.selectedEvent.id).subscribe(updated => {
      this.replaceEvent(updated);
      this.selectedEvent = updated;
    });
  }

  submitAddDog() {
    if (!this.selectedEvent || !this.addDogId) return;
    this.eventsService.addDogToEvent(this.selectedEvent.id, this.addDogId).subscribe(updated => {
      this.replaceEvent(updated);
      this.selectedEvent = updated;
      this.addDogId = null;
    });
  }

  // ── Edit Event (creator only) ─────────────────────────
  openEditForm() {
    if (!this.selectedEvent) return;
    this.editForm = { ...this.selectedEvent };
    this.showEditForm = true;
  }

  closeEditForm() { this.showEditForm = false; }

  submitEdit() {
    if (!this.selectedEvent) return;
    this.eventsService.editEvent(this.selectedEvent.id, this.editForm).subscribe(updated => {
      this.replaceEvent(updated);
      this.selectedEvent = updated;
      this.showEditForm = false;
    });
  }

  deleteEvent() {
    if (!this.selectedEvent) return;
    this.eventsService.deleteEvent(this.selectedEvent.id).subscribe(() => {
      this.events = this.events.filter(e => e.id !== this.selectedEvent!.id);
      this.closeEventDetails();
    });
  }

  private replaceEvent(updated: Event) {
    const i = this.events.findIndex(e => e.id === updated.id);
    if (i !== -1) this.events[i] = updated;
  }

  goBack() { window.history.back(); }

}
