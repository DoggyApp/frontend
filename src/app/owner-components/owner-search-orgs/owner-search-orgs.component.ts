import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgPublic } from '../../models/org-public';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-owner-search-orgs',
  templateUrl: './owner-search-orgs.component.html',
  styleUrls: ['./owner-search-orgs.component.css'],
  standalone: false
})
export class OwnerSearchOrgsComponent implements OnInit {

  readonly SEARCH_RADIUS_MILES = 40;

  nameQuery = '';
  serviceQuery = '';

  nearbyOrgs: OrgPublic[] = [];
  displayedOrgs: OrgPublic[] = [];
  orgRatings = new Map<number, number | null>();
  favoriteOrgIds = new Set<number>();

  loading = false;
  loaded = false;
  locationError = '';

  private userLat: number | null = null;
  private userLng: number | null = null;

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
    });

    this.ownerService.getFavoriteOrgs().subscribe(orgs => {
      this.favoriteOrgIds = new Set(orgs.map(o => o.id));
    });

    this.loadNearby();
  }

  loadNearby(): void {
    this.loading = true;
    this.locationError = '';
    this.getLocation().then(({ lat, lng }) => {
      this.ownerService.getNearbyOrganizations(lat, lng, this.SEARCH_RADIUS_MILES).subscribe({
        next: orgs => {
          this.nearbyOrgs = orgs;
          this.displayedOrgs = orgs;
          this.loaded = true;
          this.loading = false;
          this.loadRatings(orgs);
        },
        error: () => { this.loading = false; }
      });
    }).catch(err => {
      this.locationError = err;
      this.loading = false;
    });
  }

  searchByName(): void {
    const name = this.nameQuery.trim();
    if (!name) {
      this.displayedOrgs = this.nearbyOrgs;
      this.loadRatings(this.displayedOrgs);
      return;
    }
    this.loading = true;
    this.serviceQuery = '';
    this.ownerService.searchOrgsByName(name).subscribe({
      next: orgs => {
        this.displayedOrgs = orgs;
        this.loading = false;
        this.loadRatings(orgs);
      },
      error: () => { this.loading = false; }
    });
  }

  searchByService(): void {
    const service = this.serviceQuery.trim();
    if (!service) {
      this.displayedOrgs = this.nearbyOrgs;
      this.loadRatings(this.displayedOrgs);
      return;
    }
    this.loading = true;
    this.nameQuery = '';
    this.ownerService.searchOrgsByService(service).subscribe({
      next: orgs => {
        this.displayedOrgs = orgs;
        this.loading = false;
        this.loadRatings(orgs);
      },
      error: () => { this.loading = false; }
    });
  }

  clearSearch(): void {
    this.nameQuery = '';
    this.serviceQuery = '';
    this.displayedOrgs = this.nearbyOrgs;
    this.loadRatings(this.displayedOrgs);
  }

  private loadRatings(orgs: OrgPublic[]): void {
    orgs.forEach(org => {
      if (!this.orgRatings.has(org.id)) {
        this.ownerService.getOrgMeanRating(org.id).subscribe(rating => {
          this.orgRatings.set(org.id, rating);
          this.orgRatings = new Map(this.orgRatings);
        });
      }
    });
  }

  getRating(orgId: number): string {
    const r = this.orgRatings.get(orgId);
    if (r === undefined) return '—';
    if (r === null) return 'No reviews';
    return r.toFixed(1);
  }

  isFavorite(orgId: number): boolean {
    return this.favoriteOrgIds.has(orgId);
  }

  toggleFavorite(org: OrgPublic): void {
    if (this.isFavorite(org.id)) {
      this.ownerService.removeFavoriteOrg(org.id).subscribe(() => {
        this.favoriteOrgIds.delete(org.id);
        this.favoriteOrgIds = new Set(this.favoriteOrgIds);
      });
    } else {
      this.ownerService.addFavoriteOrg(org.id).subscribe(() => {
        this.favoriteOrgIds.add(org.id);
        this.favoriteOrgIds = new Set(this.favoriteOrgIds);
      });
    }
  }

  viewProfile(orgId: number): void {
    this.router.navigate(['/public-org-profile', orgId]);
  }

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
}
