import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { UserService } from '../../services/user/user.service';
import { OwnerService } from '../../services/owner/owner.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../services/auth/auth.service';

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
    private authService: AuthService
  ) {}

  private get svc(): any {
    const s = this.authService.currentSession;
    if (s === 'owner') return this.ownerService;
    if (s === 'user')  return this.userService;
    if (s === 'org')   return this.organizationService;
    return null;
  }

  get isOrg(): boolean   { return this.authService.currentSession === 'org'; }
  get isUser(): boolean  { return this.authService.currentSession === 'user'; }
  get isOwner(): boolean { return this.authService.currentSession === 'owner'; }

  dogId!: number;
  currentUser: any = null;
  profileDog: Dog | null = null;
  events: CalendarEvent[] = [];
  rooms: Room[] = [];
  allDogs: Dog[] = [];

  showAddEventForm = false;
  selectedEvent: CalendarEvent | null = null;

  currentDate = new Date();
  weekDays: Date[] = [];
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 6);

  ngOnInit(): void {
    if (!this.svc) { this.router.navigate(['/']); return; }
    this.dogId = Number(this.route.snapshot.paramMap.get('id'));
    this.generateWeek();
    this.svc.getSession().subscribe((entity: any) => { this.currentUser = entity; });
    this.svc.getEventsByDog(this.dogId).subscribe((events: CalendarEvent[]) => this.events = events);
    this.svc.getDogById(this.dogId).subscribe((dog: Dog | null) => { this.profileDog = dog; });

    if (this.isOwner) this.ownerService.getDogs().subscribe((dogs: Dog[]) => this.allDogs = dogs);
    if (this.isUser)  this.userService.getRooms().subscribe((rooms: Room[]) => this.rooms = rooms);
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
      s === 'user'  ? event.userCreator?.id === this.currentUser.id : false
    );
    return {
      position: 'absolute', top: `${top}px`, left: '2px', right: '2px',
      height: `${height}px`, backgroundColor: mine ? '#198754' : '#0d6efd',
      color: 'white', borderRadius: '4px', padding: '2px 4px',
      fontSize: '11px', overflow: 'hidden', cursor: 'pointer', zIndex: '1'
    };
  }

  // ── Modal coordination ─────────────────────────────────

  openAddEventForm(): void   { this.showAddEventForm = true; }
  closeAddEventForm(): void  { this.showAddEventForm = false; }
  onEventCreated(): void     { this.loadEvents(); this.showAddEventForm = false; }

  openEventDetails(event: CalendarEvent): void { this.selectedEvent = event; }
  closeEventDetails(): void                    { this.selectedEvent = null; }

  onEventUpdated(updated: CalendarEvent): void {
    const i = this.events.findIndex(e => e.id === updated.id);
    if (i !== -1) this.events[i] = updated;
    this.selectedEvent = updated;
  }

  onEventDeleted(id: number): void {
    this.events = this.events.filter(e => e.id !== id);
    this.selectedEvent = null;
  }
}
