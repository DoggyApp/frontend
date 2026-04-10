import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../models/owner';
import { Organization } from '../models/organization';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css'],
  standalone: false
})
export class OwnerDashboardComponent implements OnInit {

  currentOwner: Owner | null = null;
  favoriteOrgs: Organization[] = [];

  friends: Owner[] = [];
  friendSearch = '';
  friendSearchResults: Owner[] = [];
  friendSearchLoading = false;

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/owner-login']);
        return;
      }
      this.currentOwner = owner;
    });

    this.ownerService.getFavoriteOrgs().subscribe(orgs => {
      this.favoriteOrgs = orgs;
    });

    this.ownerService.getFriends().subscribe(friends => {
      this.friends = friends;
    });
  }

  // ── Favorite Orgs ────────────────────────────────────

  removeFavorite(orgId: number): void {
    this.ownerService.removeFavoriteOrg(orgId).subscribe(() => {
      this.favoriteOrgs = this.favoriteOrgs.filter(o => o.id !== orgId);
    });
  }

  // ── Friends ──────────────────────────────────────────

  onFriendSearch(): void {
    const q = this.friendSearch.trim();
    if (!q) { this.friendSearchResults = []; return; }
    this.friendSearchLoading = true;
    this.ownerService.searchOwners(q).subscribe(results => {
      this.friendSearchResults = results.filter(r =>
        r.id !== this.currentOwner?.id &&
        !this.friends.some(f => f.id === r.id)
      );
      this.friendSearchLoading = false;
    });
  }

  addFriend(owner: Owner): void {
    this.ownerService.addFriend(owner.id).subscribe(() => {
      this.friends.push(owner);
      this.friendSearchResults = this.friendSearchResults.filter(r => r.id !== owner.id);
      this.friendSearch = '';
    });
  }

  removeFriend(ownerId: number): void {
    this.ownerService.removeFriend(ownerId).subscribe(() => {
      this.friends = this.friends.filter(f => f.id !== ownerId);
    });
  }
}
