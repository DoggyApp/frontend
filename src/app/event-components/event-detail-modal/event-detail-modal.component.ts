import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Subject, Subscription, forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { User } from '../../models/user';
import { EventInvitation } from '../../models/event-invitation';
import { UserService } from '../../services/user/user.service';
import { OwnerService } from '../../services/owner/owner.service';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../services/auth/auth.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';
import { OwnerPublicSearch, OwnerSearchResult } from '../../models/owner-public';

@Component({
  selector: 'app-event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.css'],
  standalone: false
})
export class EventDetailModalComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

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
    const creator = this.isOwner ? this.event.ownerCreator : this.event.userCreator;
    return !!creator && creator.id === this.currentUser.id;
  }

  get isAlreadyAttending(): boolean {
    if (this.isCreator) return true;
    if (!this.currentUser || !this.event) return false;
    if (this.isOwner) return (this.event.ownerAttendees ?? []).some(o => o.id === this.currentUser.id);
    if (this.isUser)  return (this.event.userAttendees ?? []).some(u => u.id === this.currentUser.id);
    return false;
  }

  get creatorName(): string {
    if (!this.event) return '';
    if (this.event.ownerCreator) return `${this.event.ownerCreator.firstName} ${this.event.ownerCreator.lastName}`;
    if (this.event.userCreator)  return `${this.event.userCreator.firstName} ${this.event.userCreator.lastName}`;
    return 'Unknown';
  }

  // Edit form state
  showEditForm = false;
  editForm: Partial<CalendarEvent> = {};
  editRoomId: number | null = null;
  private editPlacesAttached = false;

  // Add-attendee search (users only, mirrors create modal)
  attendeeSearch = '';
  filteredAttendees: Array<{ id: number; firstName: string; lastName: string; type: 'user' | 'owner' }> = [];

  // Add-friend search (owners only, mirrors create modal)
  friendSearch = '';
  filteredFriends: OwnerPublicSearch[] = [];

  // Add-dog state
  dogSearch = '';
  filteredDogs: Dog[] = [];

  // Pending invitations (owner hosts only)
  pendingInvitations: EventInvitation[] = [];

  private dogSearchSubject      = new Subject<string>();
  private attendeeSearchSubject = new Subject<string>();
  private friendSearchSubject   = new Subject<string>();
  private subs = new Subscription();

  ngOnInit(): void {
    if (this.isUser) {
      this.subs.add(
        this.dogSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim() ? this.userService.searchDogs(q) : of([]))
        ).subscribe(dogs => {
          this.filteredDogs = dogs.filter(d => !(this.event?.dogs ?? []).some(ed => ed.id === d.id));
        })
      );

      this.subs.add(
        this.attendeeSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim()
            ? forkJoin({ users: this.userService.searchCoworkers(q), owners: this.userService.searchClients(q) })
            : of({ users: [], owners: [] })
          )
        ).subscribe(({ users, owners }) => {
          const newUsers  = users.filter((u: User) => !(this.event?.userAttendees ?? []).some(a => a.id === u.id));
          const newOwners = owners.filter((o: OwnerSearchResult) => !(this.event?.ownerAttendees ?? []).some(a => a.id === o.id));
          this.filteredAttendees = [
            ...newUsers.map((u: User) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, type: 'user' as const })),
            ...newOwners.map((o: OwnerSearchResult) => ({ id: o.id, firstName: o.firstName, lastName: o.lastName, type: 'owner' as const }))
          ];
        })
      );
    }

    if (this.isOwner) {
      this.subs.add(
        this.friendSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim() ? this.ownerService.searchFriends(q) : of([]))
        ).subscribe(friends => {
          this.filteredFriends = friends.filter(f =>
            !(this.event?.ownerAttendees ?? []).some((a: any) => a.handle === f.handle)
          );
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      this.showEditForm = false;
      this.editPlacesAttached = false;
      this.dogSearch = '';
      this.filteredDogs = [];
      this.attendeeSearch = '';
      this.filteredAttendees = [];
      this.friendSearch = '';
      this.filteredFriends = [];
      this.pendingInvitations = [];

      if (this.isCreator && this.isOwner) {
        this.loadPendingInvitations();
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.showEditForm && !this.editPlacesAttached) {
      const container = document.getElementById('editAddressContainer') as HTMLDivElement;
      if (container) {
        this.placesService.attachPlaceElement(container, addr => { this.editForm.address = addr; });
        this.editPlacesAttached = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadPendingInvitations(): void {
    this.subs.add(
      this.ownerService.getEventInvitations(this.event.id).subscribe({
        next: invitations => { this.pendingInvitations = invitations; },
        error: () => {}
      })
    );
  }

  // ── Edit ────────────────────────────────────────────────────────────────────

  openEditForm(): void {
    this.editForm = {
      event: this.event.event,
      description: this.event.description,
      address: this.event.address ?? '',
      startTime: this.event.startTime,
      endTime: this.event.endTime
    };
    this.editRoomId = this.event.room?.id ?? null;
    this.editPlacesAttached = false;
    this.showEditForm = true;
  }

  closeEditForm(): void {
    this.showEditForm = false;
    this.editPlacesAttached = false;
  }

  onEditRoomChange(): void {
    const room = this.rooms.find(r => r.id === this.editRoomId);
    if (room?.location?.address) this.editForm.address = room.location.address;
  }

  submitEdit(): void {
    if (!this.svc) return;
    const payload: any = { ...this.editForm };
    if (this.editRoomId) payload.roomId = this.editRoomId;
    this.svc.editEvent(this.event.id, payload).subscribe((updated: CalendarEvent) => {
      this.showEditForm = false;
      this.editPlacesAttached = false;
      this.eventUpdated.emit(updated);
    });
  }

  // ── Dogs ────────────────────────────────────────────────────────────────────

  get ownerDogsNotInEvent(): Dog[] {
    const inEvent = new Set((this.event?.dogs ?? []).map(d => d.id));
    return this.allDogs.filter(d => !inEvent.has(d.id));
  }

  onDogSearch(): void { this.dogSearchSubject.next(this.dogSearch); }

  addDogToEvent(dog: Dog): void {
    this.svc.addDogToEvent(this.event.id, dog.id).subscribe(() => {
      this.event = { ...this.event, dogs: [...(this.event.dogs ?? []), dog] };
      this.dogSearch = '';
      this.filteredDogs = [];
    });
  }

  removeDogFromEvent(dogId: number): void {
    this.svc.removeDogFromEvent(this.event.id, dogId).subscribe(() => {
      this.event = { ...this.event, dogs: (this.event.dogs ?? []).filter(d => d.id !== dogId) };
    });
  }

  // ── Attendees (users only) ───────────────────────────────────────────────────

  onAttendeeSearch(): void { this.attendeeSearchSubject.next(this.attendeeSearch); }

  addAttendee(a: { id: number; firstName: string; lastName: string; type: 'user' | 'owner' }): void {
    const call = a.type === 'user'
      ? this.userService.addUserAttendee(this.event.id, a.id)
      : this.userService.addOwnerAttendee(this.event.id, a.id);
    call.subscribe(() => {
      if (a.type === 'user') {
        const u: User = { id: a.id, firstName: a.firstName, lastName: a.lastName, email: '', password: '' };
        this.event = { ...this.event, userAttendees: [...(this.event.userAttendees ?? []), u] };
      } else {
        const o: any = { id: a.id, firstName: a.firstName, lastName: a.lastName };
        this.event = { ...this.event, ownerAttendees: [...(this.event.ownerAttendees ?? []), o] };
      }
      this.attendeeSearch = '';
      this.filteredAttendees = [];
    });
  }

  removeUserAttendee(userId: number): void {
    this.userService.removeUserAttendee(this.event.id, userId).subscribe(() => {
      this.event = { ...this.event, userAttendees: (this.event.userAttendees ?? []).filter(u => u.id !== userId) };
    });
  }

  removeOwnerAttendeeUser(ownerId: number): void {
    this.userService.removeOwnerAttendee(this.event.id, ownerId).subscribe(() => {
      this.event = { ...this.event, ownerAttendees: (this.event.ownerAttendees ?? []).filter((o: any) => o.id !== ownerId) };
    });
  }

  // ── Friends / Attendees (owners only) ───────────────────────────────────────

  onFriendSearch(): void { this.friendSearchSubject.next(this.friendSearch); }

  inviteFriend(friend: OwnerPublicSearch): void {
    this.ownerService.sendInvitation(this.event.id, friend.handle).subscribe(inv => {
      this.pendingInvitations = [...this.pendingInvitations, inv];
      this.friendSearch = '';
      this.filteredFriends = [];
    });
  }

  removeOwnerAttendeeOwner(ownerId: number): void {
    this.ownerService.removeOwnerAttendeeFromEvent(this.event.id, ownerId).subscribe(() => {
      this.event = { ...this.event, ownerAttendees: (this.event.ownerAttendees ?? []).filter((o: any) => o.id !== ownerId) };
    });
  }

  cancelInvitation(invitationId: number): void {
    this.ownerService.cancelEventInvitation(this.event.id, invitationId).subscribe(() => {
      this.pendingInvitations = this.pendingInvitations.filter(i => i.id !== invitationId);
    });
  }

  // ── Join / Delete ────────────────────────────────────────────────────────────

  joinEvent(): void {
    this.svc.joinEvent(this.event.id).subscribe();
  }

  deleteEvent(): void {
    this.svc.deleteEvent(this.event.id).subscribe(() => {
      this.eventDeleted.emit(this.event.id);
    });
  }
}
