import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject, Subscription, forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CalendarEvent } from '../../models/event';
import { Room } from '../../models/room';
import { Dog } from '../../models/dog';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { OwnerService } from '../../services/owner/owner.service';
import { AuthService } from '../../services/auth/auth.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';
import { OwnerPublicSearch, OwnerSearchResult } from '../../models/owner-public';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.css'],
  standalone: false
})
export class CreateEventModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() dogId!: number;
  @Input() profileDog: Dog | null = null;
  @Input() rooms: Room[] = [];
  @Input() allDogs: Dog[] = [];

  @Output() eventCreated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private ownerService: OwnerService,
    private authService: AuthService,
    private placesService: GooglePlacesService
  ) {}

  private get svc(): any {
    const s = this.authService.currentSession;
    if (s === 'owner') return this.ownerService;
    if (s === 'user')  return this.userService;
    return null;
  }

  get isUser(): boolean  { return this.authService.currentSession === 'user'; }
  get isOwner(): boolean { return this.authService.currentSession === 'owner'; }

  newEvent: Partial<CalendarEvent> = {};
  selectedRoomId: number | null = null;
  selectedDogs: Dog[] = [];

  dogSearch = '';
  filteredDogs: Dog[] = [];

  friendSearch = '';
  filteredFriends: OwnerPublicSearch[] = [];
  invitedFriends: OwnerPublicSearch[] = [];

  attendeeSearch = '';
  filteredAttendees: Array<{ id: number; firstName: string; lastName: string; type: 'user' | 'owner' }> = [];
  selectedUserAttendees: User[] = [];
  selectedOwnerAttendees: OwnerSearchResult[] = [];

  private dogSearchSubject      = new Subject<string>();
  private friendSearchSubject   = new Subject<string>();
  private attendeeSearchSubject = new Subject<string>();
  private subs = new Subscription();

  ngOnInit(): void {
    this.newEvent = { event: '', description: '', address: '', startTime: '', endTime: '' };
    this.selectedDogs = this.profileDog ? [this.profileDog] : [];

    if (this.isOwner) {
      this.subs.add(
        this.friendSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim() ? this.ownerService.searchFriends(q) : of([]))
        ).subscribe(friends => {
          this.filteredFriends = friends.filter(f => !this.invitedFriends.some(i => i.handle === f.handle));
        })
      );
    }

    if (this.isUser) {
      this.subs.add(
        this.dogSearchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => q.trim() ? this.userService.searchDogs(q) : of([]))
        ).subscribe(dogs => {
          this.filteredDogs = dogs.filter(d => !this.selectedDogs.some(s => s.id === d.id));
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
          const newUsers  = users.filter((u: User) => !this.selectedUserAttendees.some(a => a.id === u.id));
          const newOwners = owners.filter((o: OwnerSearchResult) => !this.selectedOwnerAttendees.some(a => a.id === o.id));
          this.filteredAttendees = [
            ...newUsers.map((u: User) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, type: 'user' as const })),
            ...newOwners.map((o: OwnerSearchResult) => ({ id: o.id, firstName: o.firstName, lastName: o.lastName, type: 'owner' as const }))
          ];
        })
      );
    }
  }

  ngAfterViewInit(): void {
    const container = document.getElementById('createAddressContainer') as HTMLDivElement;
    if (container) {
      this.placesService.attachPlaceElement(container, addr => { this.newEvent.address = addr; });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onRoomChange(): void {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    const address = room?.location?.address ?? '';
    if (address) this.newEvent.address = address;
  }

  toggleOwnerDog(dog: Dog): void {
    if (this.selectedDogs.some(d => d.id === dog.id)) {
      if (dog.id === this.dogId) return;
      this.selectedDogs = this.selectedDogs.filter(d => d.id !== dog.id);
    } else {
      this.selectedDogs = [...this.selectedDogs, dog];
    }
  }

  onDogSearch(): void { this.dogSearchSubject.next(this.dogSearch); }

  addDogToForm(dog: Dog): void {
    this.selectedDogs = [...this.selectedDogs, dog];
    this.dogSearch = '';
    this.filteredDogs = [];
  }

  removeDogFromForm(dogId: number): void {
    if (dogId === this.dogId) return;
    this.selectedDogs = this.selectedDogs.filter(d => d.id !== dogId);
  }

  isDogSelected(dog: Dog): boolean {
    return this.selectedDogs.some(s => s.id === dog.id);
  }

  isProfileDog(dog: Dog): boolean {
    return dog.id === this.dogId;
  }

  onFriendSearch(): void { this.friendSearchSubject.next(this.friendSearch); }

  addFriendToInvite(friend: OwnerPublicSearch): void {
    if (!this.invitedFriends.some(f => f.handle === friend.handle)) {
      this.invitedFriends = [...this.invitedFriends, friend];
    }
    this.friendSearch = '';
    this.filteredFriends = [];
  }

  removeFriendFromInvite(handle: string): void {
    this.invitedFriends = this.invitedFriends.filter(f => f.handle !== handle);
  }

  onAttendeeSearch(): void { this.attendeeSearchSubject.next(this.attendeeSearch); }

  selectAttendee(a: { id: number; firstName: string; lastName: string; type: 'user' | 'owner' }): void {
    if (a.type === 'user') {
      if (!this.selectedUserAttendees.some(u => u.id === a.id)) {
        this.selectedUserAttendees = [...this.selectedUserAttendees,
          { id: a.id, firstName: a.firstName, lastName: a.lastName, email: '', password: '' }];
      }
    } else {
      if (!this.selectedOwnerAttendees.some(o => o.id === a.id)) {
        this.selectedOwnerAttendees = [...this.selectedOwnerAttendees,
          { id: a.id, firstName: a.firstName, lastName: a.lastName }];
      }
    }
    this.attendeeSearch = '';
    this.filteredAttendees = [];
  }

  removeUserAttendee(id: number): void {
    this.selectedUserAttendees = this.selectedUserAttendees.filter(a => a.id !== id);
  }

  removeOwnerAttendee(id: number): void {
    this.selectedOwnerAttendees = this.selectedOwnerAttendees.filter(a => a.id !== id);
  }

  submit(): void {
    if (!this.svc) return;
    const payload: any = { ...this.newEvent };
    if (this.selectedRoomId) payload.roomId = this.selectedRoomId;
    this.svc.createEvent(payload).subscribe((created: CalendarEvent) => {
      const dogOps = this.selectedDogs.map((d: Dog) => this.svc.addDogToEvent(created.id, d.id));
      const inviteOps = this.isOwner
        ? this.invitedFriends.map(f => this.ownerService.sendInvitation(created.id, f.handle))
        : [];
      const attendeeOps = this.isUser
        ? [
            ...this.selectedUserAttendees.map(a => this.userService.addUserAttendee(created.id, a.id)),
            ...this.selectedOwnerAttendees.map(a => this.userService.addOwnerAttendee(created.id, a.id))
          ]
        : [];
      const all = [...dogOps, ...inviteOps, ...attendeeOps];
      const finish = () => this.eventCreated.emit();
      if (all.length === 0) { finish(); } else { forkJoin(all).subscribe({ next: finish, error: finish }); }
    });
  }
}
