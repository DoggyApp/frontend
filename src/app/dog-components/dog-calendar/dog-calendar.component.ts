import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { UserService } from '../../services/user/user.service';
import { OwnerService } from '../../services/owner/owner.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../services/auth/auth.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';

@Component({
  selector: 'app-dog-calendar',
  templateUrl: './dog-calendar.component.html',
  styleUrls: ['./dog-calendar.component.css'],
  standalone: false
})
export class DogCalendarComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private ownerService: OwnerService,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private placesService: GooglePlacesService
  ) {}

  private get svc(): any {
    const s = this.authService.currentSession;
    if (s === 'owner') return this.ownerService;
    if (s === 'user')  return this.userService;
    if (s === 'org')   return this.organizationService;
    return null;
  }

  get isOrg(): boolean  { return this.authService.currentSession === 'org'; }
  get isUser(): boolean { return this.authService.currentSession === 'user'; }

  dogId!: number;
  currentUser: any = null;
  profileDog: Dog | null = null;
  events: CalendarEvent[] = [];
  rooms: Room[] = [];
  allDogs: Dog[] = [];
  selectedRoomId: number | null = null;

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

  private autocompleteCreate: any = null;
  private autocompleteEdit: any = null;

  ngOnInit(): void {
    if (!this.svc) { this.router.navigate(['/']); return; }
    this.dogId = Number(this.route.snapshot.paramMap.get('id'));
    this.generateWeek();
    this.svc.getSession().subscribe((entity: any) => { this.currentUser = entity; });
    this.svc.getEventsByDog(this.dogId).subscribe((events: CalendarEvent[]) => this.events = events);
    this.svc.getDogs().subscribe((dogs: Dog[]) => this.allDogs = dogs);
    if (this.isUser) this.userService.getRooms().subscribe((rooms: Room[]) => this.rooms = rooms);
  }

  loadEvents(): void {
    this.svc.getEventsByDog(this.dogId).subscribe((events: CalendarEvent[]) => this.events = events);
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
    const s = this.authService.currentSession;
    const mine = this.currentUser && (
      s === 'owner' ? event.ownerCreator?.id === this.currentUser.id :
      s === 'user'  ? event.userCreator?.id === this.currentUser.id :
      false
    );
    return {
      position: 'absolute', top: `${top}px`, left: '2px', right: '2px',
      height: `${height}px`, backgroundColor: mine ? '#198754' : '#0d6efd',
      color: 'white', borderRadius: '4px', padding: '2px 4px',
      fontSize: '11px', overflow: 'hidden', cursor: 'pointer', zIndex: '1'
    };
  }

  // ── Create event ───────────────────────────────────────

  openAddEventForm(): void {
    if (this.isOrg) return;
    this.newEvent = { event: '', description: '', address: '', startTime: '', endTime: '' };
    this.selectedRoomId = null;
    this.selectedDogs = this.profileDog ? [this.profileDog] : [];
    this.dogSearch = '';
    this.filteredDogs = [];
    this.showAddEventForm = true;
    this.attachCreateAutocomplete();
  }

  closeAddEventForm(): void {
    this.showAddEventForm = false;
    this.autocompleteCreate = null;
  }

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
    if (dogId === this.dogId) return;
    this.selectedDogs = this.selectedDogs.filter(d => d.id !== dogId);
  }

  onRoomChange(form: 'create' | 'edit'): void {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    const address = room?.location?.address ?? '';
    if (!address) return;
    if (form === 'create') this.newEvent.address = address;
    else this.editForm.address = address;
  }

  submitAddEvent(): void {
    if (this.isOrg) return;
    const payload: any = { ...this.newEvent };
    if (this.selectedRoomId) payload.roomId = this.selectedRoomId;
    this.svc.createEvent(payload).subscribe((created: CalendarEvent) => {
      const ops = this.selectedDogs.map((d: Dog) => this.svc.addDogToEvent(created.id, d.id));
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
    const s = this.authService.currentSession;
    if (s === 'owner') {
      this.isCreator = !!this.currentUser && event.ownerCreator?.id === this.currentUser.id;
    } else if (s === 'user') {
      this.isCreator = !!this.currentUser && event.userCreator?.id === this.currentUser.id;
    } else {
      this.isCreator = false;
    }
    this.showEditForm = false;
    this.popupDogSearch = '';
    this.popupFilteredDogs = [];
  }

  closeEventDetails(): void { this.selectedEvent = null; this.showEditForm = false; }

  isAlreadyJoined(): boolean {
    if (!this.currentUser || !this.selectedEvent) return false;
    const s = this.authService.currentSession;
    if (s === 'owner') {
      return (this.selectedEvent.ownerAttendees ?? []).some(t => t.id === this.currentUser.id);
    } else if (s === 'user') {
      return (this.selectedEvent.userAttendees ?? []).some(t => t.id === this.currentUser.id);
    }
    return false;
  }

  joinEvent(): void {
    if (this.isOrg || !this.selectedEvent) return;
    this.svc.joinEvent(this.selectedEvent.id).subscribe();
  }

  // ── Edit ──────────────────────────────────────────────

  openEditForm(): void {
    if (!this.selectedEvent) return;
    this.editForm = {
      event: this.selectedEvent.event,
      description: this.selectedEvent.description,
      address: this.selectedEvent.address ?? '',
      startTime: this.selectedEvent.startTime,
      endTime: this.selectedEvent.endTime
    };
    this.selectedRoomId = this.selectedEvent.room?.id ?? null;
    this.showEditForm = true;
    this.attachEditAutocomplete();
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.autocompleteEdit = null;
  }

  submitEdit(): void {
    if (this.isOrg || !this.selectedEvent) return;
    const payload: any = { ...this.editForm };
    if (this.selectedRoomId) payload.roomId = this.selectedRoomId;
    this.svc.editEvent(this.selectedEvent.id, payload).subscribe((updated: CalendarEvent) => {
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
    if (this.isOrg || !this.selectedEvent) return;
    this.svc.addDogToEvent(this.selectedEvent.id, dog.id).subscribe(() => {
      this.popupDogSearch = '';
      this.popupFilteredDogs = [];
    });
  }

  // ── Delete ────────────────────────────────────────────

  deleteEvent(): void {
    if (this.isOrg || !this.selectedEvent) return;
    this.svc.deleteEvent(this.selectedEvent.id).subscribe(() => {
      this.events = this.events.filter(e => e.id !== this.selectedEvent!.id);
      this.closeEventDetails();
    });
  }

  private replaceEvent(updated: CalendarEvent): void {
    const i = this.events.findIndex(e => e.id === updated.id);
    if (i !== -1) this.events[i] = updated;
  }

  // ── Google Places autocomplete ────────────────────────

  private attachCreateAutocomplete(): void {
    setTimeout(() => {
      const container = document.getElementById('createAddressContainer') as HTMLDivElement;
      if (!container) return;
      this.placesService.attachPlaceElement(container, addr => { this.newEvent.address = addr; })
        .then(el => { this.autocompleteCreate = el; });
    }, 100);
  }

  private attachEditAutocomplete(): void {
    setTimeout(() => {
      const container = document.getElementById('editAddressContainer') as HTMLDivElement;
      if (!container) return;
      this.placesService.attachPlaceElement(container, addr => { this.editForm.address = addr; })
        .then(el => { this.autocompleteEdit = el; });
    }, 100);
  }
}
