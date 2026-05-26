import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerPublicSearch, OwnerPublicFriend } from '../../models/owner-public';
import { OrgPublic } from '../../models/org-public';
import { FriendRequest } from '../../models/friend-request';
import { EventInvitation } from '../../models/event-invitation';
import { OwnerService } from '../../services/owner/owner.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css'],
  standalone: false
})
export class OwnerDashboardComponent implements OnInit {

  currentOwner: Owner | null = null;
  favoriteOrgs: OrgPublic[] = [];

  friends: OwnerPublicFriend[] = [];
  friendSearch = '';
  friendSearchResult: OwnerPublicSearch | null = null;
  friendSearchLoading = false;
  friendSearchError = '';
  requestSent = false;

  pendingRequests: FriendRequest[] = [];
  eventInvitations: EventInvitation[] = [];

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/']);
        return;
      }
      this.authService.setSession('owner');
      this.currentOwner = owner;
    });

    this.ownerService.getFavoriteOrgs().subscribe(orgs => {
      this.favoriteOrgs = orgs;
    });

    this.ownerService.getFriends().subscribe(friends => {
      this.friends = friends;
    });

    this.ownerService.getPendingRequests().subscribe(requests => {
      this.pendingRequests = requests;
    });

    this.ownerService.getInvitations().subscribe(invitations => {
      this.eventInvitations = invitations;
    });
  }

  // ── Favorite Orgs ────────────────────────────────────────────────────────

  removeFavorite(orgId: number): void {
    this.ownerService.removeFavoriteOrg(orgId).subscribe(() => {
      this.favoriteOrgs = this.favoriteOrgs.filter(o => o.id !== orgId);
    });
  }

  // ── Friend Search & Requests ─────────────────────────────────────────────

  onFriendSearch(): void {
    const q = this.friendSearch.trim().replace(/^@/, '');
    this.friendSearchResult = null;
    this.friendSearchError = '';
    this.requestSent = false;

    if (!q) return;

    this.friendSearchLoading = true;
    this.ownerService.searchOwners(q).subscribe({
      next: result => {
        this.friendSearchLoading = false;
        // Backend returns a single owner (exact handle match), wrapped as array
        const owner = Array.isArray(result) ? result[0] : result as unknown as OwnerPublicSearch;
        if (!owner) {
          this.friendSearchError = 'No owner found with that handle.';
          return;
        }
        if (owner.handle === this.currentOwner?.handle) {
          this.friendSearchError = 'That\'s you!';
          return;
        }
        if (this.friends.some(f => f.handle === owner.handle)) {
          this.friendSearchError = 'Already friends.';
          return;
        }
        this.friendSearchResult = owner;
      },
      error: () => {
        this.friendSearchLoading = false;
        this.friendSearchError = 'No owner found with that handle.';
      }
    });
  }

  sendFriendRequest(owner: OwnerPublicSearch): void {
    this.ownerService.sendFriendRequest(owner.handle).subscribe({
      next: () => {
        this.requestSent = true;
        this.friendSearchResult = null;
        this.friendSearch = '';
      },
      error: () => {
        this.friendSearchError = 'Could not send request. It may already exist.';
      }
    });
  }

  // ── Pending Requests ─────────────────────────────────────────────────────

  acceptRequest(request: FriendRequest): void {
    this.ownerService.acceptFriendRequest(request.id).subscribe(() => {
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
      // Reload the full friends list so we get OwnerPublicFriend (with dogs, etc.)
      this.ownerService.getFriends().subscribe(friends => {
        this.friends = friends;
      });
    });
  }

  rejectRequest(request: FriendRequest): void {
    this.ownerService.rejectFriendRequest(request.id).subscribe(() => {
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
    });
  }

  // ── Event Invitations ────────────────────────────────────────────────────

  acceptEventInvitation(invitation: EventInvitation): void {
    this.ownerService.acceptInvitation(invitation.id).subscribe(() => {
      this.eventInvitations = this.eventInvitations.filter(i => i.id !== invitation.id);
    });
  }

  declineEventInvitation(invitation: EventInvitation): void {
    this.ownerService.declineInvitation(invitation.id).subscribe(() => {
      this.eventInvitations = this.eventInvitations.filter(i => i.id !== invitation.id);
    });
  }

  // ── Friends List ─────────────────────────────────────────────────────────

  removeFriend(handle: string): void {
    this.ownerService.removeFriend(handle).subscribe(() => {
      this.friends = this.friends.filter(f => f.handle !== handle);
    });
  }
}