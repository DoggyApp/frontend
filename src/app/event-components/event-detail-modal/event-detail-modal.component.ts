import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { UserService } from '../../services/user/user.service';
import { OwnerService } from '../../services/owner/owner.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../services/auth/auth.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';

@Component({
  selector: 'app-event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.css'],
  standalone: false
})
export class EventDetailModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input() event!: CalendarEvent;
  @Input() currentUser: any = null;
  @Input() rooms: Room[] = [];
  @Input() allDogs: Dog[] = [];

  @Output() eventUpdated = new EventEmitter<CalendarEvent>();
  @Output() eventDeleted = new EventEmitter<number>();
  @Output() closed = new EventEmitter<void>();

  constructor(
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

  get isOrg(): boolean   { return this.authService.currentSession === 'org'; }
  get isUser(): boolean  { return this.authService.currentSession === 'user'; }
  get isOwner(): boolean { return this.authService.currentSession === 'owner'; }

  get isCreator(): boolean {
    if (!this.currentUser || !this.event) return false;
    const s = this.authService.currentSession;
    if (s === 'owner') return this.event.ownerCreator?.id === this.currentUser.id;
    if (s === 'user')  return this.event.userCreator?.id === this.currentUser.id;
    return false;
  }

  showEditForm = false;
  editForm: Partial<CalendarEvent> = {};
  selectedRoomId: number | null = null;

  popupDogSearch = '';
  popupFilteredDogs: Dog[] = [];

  private popupSearchSubject = new Subject<string>();
  private subs = new Subscription();

  ngOnInit(): void {
    if (this.isUser) {
      this.subs.add(
        this.popupSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim() ? this.userService.searchDogs(q) : of([]))
        ).subscribe(dogs => {
          this.popupFilteredDogs = dogs.filter(d =>
            !this.event?.dogs.some(ed => ed.id === d.id)
          );
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.showEditForm = false;
      this.popupDogSearch = '';
      this.popupFilteredDogs = [];
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get ownerDogsNotInEvent(): Dog[] {
    if (!this.event) return [];
    const inEvent = new Set(this.event.dogs.map(d => d.id));
    return this.allDogs.filter(d => !inEvent.has(d.id));
  }

  isAlreadyJoined(): boolean {
    if (!this.currentUser || !this.event) return false;
    const s = this.authService.currentSession;
    if (s === 'owner') return (this.event.ownerAttendees ?? []).some(t => t.id === this.currentUser.id);
    if (s === 'user')  return (this.event.userAttendees ?? []).some(t => t.id === this.currentUser.id);
    return false;
  }

  joinEvent(): void {
    if (this.isOrg) return;
    this.svc.joinEvent(this.event.id).subscribe();
  }

  openEditForm(): void {
    this.editForm = {
      event: this.event.event,
      description: this.event.description,
      address: this.event.address ?? '',
      startTime: this.event.startTime,
      endTime: this.event.endTime
    };
    this.selectedRoomId = this.event.room?.id ?? null;
    this.showEditForm = true;
    setTimeout(() => {
      const container = document.getElementById('editAddressContainer') as HTMLDivElement;
      if (container) {
        this.placesService.attachPlaceElement(container, addr => { this.editForm.address = addr; });
      }
    }, 100);
  }

  closeEditForm(): void {
    this.showEditForm = false;
  }

  onRoomChange(): void {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    const address = room?.location?.address ?? '';
    if (address) this.editForm.address = address;
  }

  submitEdit(): void {
    if (this.isOrg) return;
    const payload: any = { ...this.editForm };
    if (this.selectedRoomId) payload.roomId = this.selectedRoomId;
    this.svc.editEvent(this.event.id, payload).subscribe((updated: CalendarEvent) => {
      this.showEditForm = false;
      this.eventUpdated.emit(updated);
    });
  }

  onPopupDogSearch(): void {
    this.popupSearchSubject.next(this.popupDogSearch);
  }

  addDogToEvent(dog: Dog): void {
    if (this.isOrg) return;
    this.svc.addDogToEvent(this.event.id, dog.id).subscribe(() => {
      this.event = { ...this.event, dogs: [...(this.event.dogs ?? []), dog] };
      this.popupDogSearch = '';
      this.popupFilteredDogs = [];
    });
  }

  deleteEvent(): void {
    if (this.isOrg) return;
    this.svc.deleteEvent(this.event.id).subscribe(() => {
      this.eventDeleted.emit(this.event.id);
    });
  }
}
