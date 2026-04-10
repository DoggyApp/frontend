import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../models/owner';
import { Organization } from '../models/organization';
import { CalendarEvent } from '../models/event';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css'],
  standalone: false
})
export class OwnerDashboardComponent implements OnInit {

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  currentOwner: Owner | null = null;
  activeTab: 'dogs' | 'orgs' | 'events' | 'friends' = 'dogs';

  // Nearby orgs
  nearbyOrgs: Organization[] = [];
  orgsRadius = 5;
  orgsLoading = false;
  orgsLoaded = false;

  // Nearby events
  nearbyEvents: CalendarEvent[] = [];
  eventsRadius = 5;
  eventsLoading = false;
  eventsLoaded = false;

  // Friends
  friends: Owner[] = [];
  friendSearch = '';
  friendSearchResults: Owner[] = [];
  friendSearchLoading = false;

  // Geolocation
  userLat: number | null = null;
  userLng: number | null = null;
  locationError = '';

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/owner-login']);
        return;
      }
      this.currentOwner = owner;
      this.loadFriends();
    });
  }

  setTab(tab: 'dogs' | 'orgs' | 'events' | 'friends'): void {
    this.activeTab = tab;
    if (tab === 'orgs' && !this.orgsLoaded) this.loadNearbyOrgs();
    if (tab === 'events' && !this.eventsLoaded) this.loadNearbyEvents();
  }

  // ── Geolocation ──────────────────────────────────────

  private getLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (this.userLat !== null && this.userLng !== null) {
        resolve({ lat: this.userLat, lng: this.userLng });
        return;
      }
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.userLat = pos.coords.latitude;
          this.userLng = pos.coords.longitude;
          resolve({ lat: this.userLat, lng: this.userLng });
        },
        () => reject('Unable to retrieve your location. Please allow location access.')
      );
    });
  }

  // ── Nearby Orgs ──────────────────────────────────────

  loadNearbyOrgs(): void {
    this.orgsLoading = true;
    this.locationError = '';
    this.getLocation().then(({ lat, lng }) => {
      this.ownerService.getNearbyOrganizations(lat, lng, this.orgsRadius).subscribe({
        next: orgs => {
          this.nearbyOrgs = orgs;
          this.orgsLoaded = true;
          this.orgsLoading = false;
        },
        error: () => { this.orgsLoading = false; }
      });
    }).catch(err => {
      this.locationError = err;
      this.orgsLoading = false;
    });
  }

  onOrgsRadiusChange(): void {
    this.orgsLoaded = false;
    this.loadNearbyOrgs();
  }

  // ── Nearby Events ────────────────────────────────────

  loadNearbyEvents(): void {
    this.eventsLoading = true;
    this.locationError = '';
    this.getLocation().then(({ lat, lng }) => {
      this.ownerService.getNearbyEvents(lat, lng, this.eventsRadius).subscribe({
        next: events => {
          this.nearbyEvents = events;
          this.eventsLoaded = true;
          this.eventsLoading = false;
        },
        error: () => { this.eventsLoading = false; }
      });
    }).catch(err => {
      this.locationError = err;
      this.eventsLoading = false;
    });
  }

  onEventsRadiusChange(): void {
    this.eventsLoaded = false;
    this.loadNearbyEvents();
  }

  // ── Friends ──────────────────────────────────────────

  loadFriends(): void {
    this.ownerService.getFriends().subscribe(friends => {
      this.friends = friends;
    });
  }

  onFriendSearch(): void {
    const q = this.friendSearch.trim();
    if (!q) { this.friendSearchResults = []; return; }
    this.friendSearchLoading = true;
    this.ownerService.searchOwners(q).subscribe(results => {
      // Exclude self and already-friends
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
    });
  }

  removeFriend(ownerId: number): void {
    this.ownerService.removeFriend(ownerId).subscribe(() => {
      this.friends = this.friends.filter(f => f.id !== ownerId);
    });
  }

  isFriend(ownerId: number): boolean {
    return this.friends.some(f => f.id === ownerId);
  }

  logout(): void {
    this.ownerService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
