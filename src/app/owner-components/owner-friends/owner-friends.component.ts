import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerPublicSearch, OwnerPublicFriend } from '../../models/owner-public';
import { FriendRequest } from '../../models/friend-request';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-owner-friends',
  templateUrl: './owner-friends.component.html',
  styleUrls: ['./owner-friends.component.css'],
  standalone: false
})
export class OwnerFriendsComponent implements OnInit {

  currentOwner: Owner | null = null;
  friends: OwnerPublicFriend[] = [];
  pendingRequests: FriendRequest[] = [];

  showRequestsDropdown = false;

  // Friend search
  friendSearch = '';
  friendSearchResult: OwnerPublicSearch | null = null;
  friendSearchLoading = false;
  friendSearchError = '';
  requestSent = false;

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

    this.ownerService.getPendingRequests().subscribe(requests => {
      this.pendingRequests = requests;
    });
  }

  // ── Requests dropdown ────────────────────────────────────────────────────

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (!target.closest('.requests-wrapper')) {
      this.showRequestsDropdown = false;
    }
  }

  toggleRequestsDropdown(): void {
    this.showRequestsDropdown = !this.showRequestsDropdown;
  }

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

  // ── Friend search ────────────────────────────────────────────────────────

  onFriendSearch(): void {
    const q = this.friendSearch.trim();
    this.friendSearchResult = null;
    this.friendSearchError = '';
    this.requestSent = false;

    if (!q) return;

    this.friendSearchLoading = true;
    this.ownerService.searchOwners(q).subscribe({
      next: results => {
        this.friendSearchLoading = false;
        const owner = Array.isArray(results) ? results[0] : results as unknown as OwnerPublicSearch;
        if (!owner) {
          this.friendSearchError = 'No owner found with that handle.';
          return;
        }
        if (owner.handle === this.currentOwner?.handle) {
          this.friendSearchError = "That's you!";
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

  // ── Friends list ─────────────────────────────────────────────────────────

  removeFriend(handle: string): void {
    this.ownerService.removeFriend(handle).subscribe(() => {
      this.friends = this.friends.filter(f => f.handle !== handle);
    });
  }
}
