import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CalendarEvent } from '../../models/event';
import { Owner } from '../../models/owner';
import { OwnerPublicFriend } from '../../models/owner-public';
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
  friends: OwnerPublicFriend[] = [];
  loading = true;

  // ── Merged calendar list ─────────────────────────────────────────────────

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

  // ── Event detail popup ───────────────────────────────────────────────────

  selectedEvent: CalendarEvent | null = null;
  showEditForm = false;
  editForm: Partial<CalendarEvent> = {};
  showInvitePanel = false;
  inviteSentTo: Set<string> = new Set();

  // ── Invitation popup ─────────────────────────────────────────────────────

  selectedInvitation: EventInvitation | null = null;

  // ── Create event ─────────────────────────────────────────────────────────

  showCreateForm = false;
  createForm: Partial<CalendarEvent> = { event: '', description: '', address: '', startTime: '', endTime: '' };
  createInvitedFriendIds: Set<string> = new Set();
  createAddedDogIds: Set<number> = new Set();
  createLoading = false;

  // ── Leave confirmation ───────────────────────────────────────────────────

  showLeaveConfirm = false;

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

    this.ownerService.getFriends().subscribe(friends => {
      this.friends = friends;
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

  // ── Create event ─────────────────────────────────────────────────────────

  openCreateForm(): void {
    this.createForm = { event: '', description: '', address: '', startTime: '', endTime: '' };
    this.createInvitedFriendIds = new Set();
    this.createAddedDogIds = new Set();
    this.createLoading = false;
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  toggleCreateFriend(handle: string): void {
    if (this.createInvitedFriendIds.has(handle)) {
      this.createInvitedFriendIds.delete(handle);
    } else {
      this.createInvitedFriendIds.add(handle);
    }
  }

  toggleCreateDog(dogId: number): void {
    if (this.createAddedDogIds.has(dogId)) {
      this.createAddedDogIds.delete(dogId);
    } else {
      this.createAddedDogIds.add(dogId);
    }
  }

  submitCreateEvent(): void {
    if (!this.createForm.event || !this.createForm.startTime || !this.createForm.endTime) return;
    this.createLoading = true;

    this.ownerService.createEvent(this.createForm).subscribe(newEvent => {
      const friendCalls = [...this.createInvitedFriendIds].map(fId =>
        this.ownerService.sendInvitation(newEvent.id, fId)
      );
      const dogCalls = [...this.createAddedDogIds].map(dId =>
        this.ownerService.addDogToEvent(newEvent.id, dId)
      );
      const all = [...friendCalls, ...dogCalls];

      const finish = () => {
        this.createLoading = false;
        this.closeCreateForm();
        this.loadEvents();
      };

      if (all.length === 0) {
        finish();
      } else {
        forkJoin(all).subscribe({ next: finish, error: finish });
      }
    });
  }

  // ── Event detail popup ───────────────────────────────────────────────────

  openEvent(ev: CalendarEvent): void {
    this.selectedEvent = ev;
    this.showEditForm = false;
    this.showInvitePanel = false;
    this.inviteSentTo.clear();
  }

  closeEvent(): void {
    this.selectedEvent = null;
    this.showEditForm = false;
    this.showInvitePanel = false;
    this.showLeaveConfirm = false;
    this.inviteSentTo.clear();
  }

  // ── Edit ─────────────────────────────────────────────────────────────────

  openEdit(): void {
    if (!this.selectedEvent) return;
    this.editForm = {
      event: this.selectedEvent.event,
      description: this.selectedEvent.description,
      startTime: this.selectedEvent.startTime,
      endTime: this.selectedEvent.endTime,
    };
    this.showEditForm = true;
  }

  submitEdit(): void {
    if (!this.selectedEvent) return;
    this.ownerService.editEvent(this.selectedEvent.id, this.editForm).subscribe(updated => {
      this.loadEvents();
      this.selectedEvent = updated;
      this.showEditForm = false;
    });
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }

  // ── Invite friends (from event popup) ────────────────────────────────────

  get invitableFriends(): OwnerPublicFriend[] {
    if (!this.selectedEvent) return [];
    return this.friends.filter(f => !this.inviteSentTo.has(f.handle));
  }

  toggleInvitePanel(): void {
    this.showInvitePanel = !this.showInvitePanel;
  }

  inviteFriend(friend: OwnerPublicFriend): void {
    if (!this.selectedEvent) return;
    this.ownerService.sendInvitation(this.selectedEvent.id, friend.handle).subscribe({
      next: () => this.inviteSentTo.add(friend.handle),
      error: () => this.inviteSentTo.add(friend.handle)
    });
  }

  // ── Add dog to existing event ────────────────────────────────────────────

  get myDogsInEvent(): Dog[] {
    if (!this.selectedEvent || !this.currentOwner?.dogs?.length) return [];
    const myDogIds = new Set(this.currentOwner.dogs.map(d => d.id));
    return this.selectedEvent.dogs.filter(d => myDogIds.has(d.id));
  }

  get myDogsNotInEvent(): Dog[] {
    if (!this.selectedEvent || !this.currentOwner?.dogs?.length) return [];
    const eventDogIds = new Set(this.selectedEvent.dogs.map(d => d.id));
    return this.currentOwner.dogs.filter(d => !eventDogIds.has(d.id));
  }

  addDogToEvent(dog: Dog): void {
    if (!this.selectedEvent) return;
    this.ownerService.addDogToEvent(this.selectedEvent.id, dog.id).subscribe(() => {
      if (this.selectedEvent) {
        this.selectedEvent = {
          ...this.selectedEvent,
          dogs: [...this.selectedEvent.dogs, dog]
        };
      }
      this.loadEvents();
    });
  }

  removeDog(dog: Dog): void {
    if (!this.selectedEvent) return;
    this.ownerService.removeDogFromEvent(this.selectedEvent.id, dog.id).subscribe(() => {
      if (this.selectedEvent) {
        this.selectedEvent = {
          ...this.selectedEvent,
          dogs: this.selectedEvent.dogs.filter(d => d.id !== dog.id)
        };
      }
      this.loadEvents();
    });
  }

  // ── Delete ───────────────────────────────────────────────────────────────

  deleteEvent(): void {
    if (!this.selectedEvent) return;
    this.ownerService.deleteEvent(this.selectedEvent.id).subscribe(() => {
      this.closeEvent();
      this.loadEvents();
    });
  }

  // ── Leave event ──────────────────────────────────────────────────────────

  initiateLeave(): void {
    if (!this.selectedEvent) return;
    if (this.myDogsInEvent.length > 0) {
      this.showLeaveConfirm = true;
    } else {
      this.executeLeave(false);
    }
  }

  confirmLeaveWithDogs(): void {
    this.showLeaveConfirm = false;
    this.executeLeave(true);
  }

  confirmLeaveOnly(): void {
    this.showLeaveConfirm = false;
    this.executeLeave(false);
  }

  cancelLeave(): void {
    this.showLeaveConfirm = false;
  }

  private executeLeave(removeDogs: boolean): void {
    if (!this.selectedEvent) return;
    const eventId = this.selectedEvent.id;

    const doLeave = () => {
      this.ownerService.leaveEvent(eventId).subscribe(() => {
        this.closeEvent();
        this.loadEvents();
      });
    };

    if (removeDogs && this.myDogsInEvent.length > 0) {
      const dogIds = this.myDogsInEvent.map(d => d.id);
      let remaining = dogIds.length;
      dogIds.forEach(dogId => {
        this.ownerService.removeDogFromEvent(eventId, dogId).subscribe(() => {
          remaining--;
          if (remaining === 0) doLeave();
        });
      });
    } else {
      doLeave();
    }
  }

  // ── Invitation popup ─────────────────────────────────────────────────────

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
