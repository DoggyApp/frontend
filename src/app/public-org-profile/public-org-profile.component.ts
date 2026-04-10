import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization } from '../models/organization';
import { Service } from '../models/service';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-public-org-profile',
  templateUrl: './public-org-profile.component.html',
  styleUrls: ['./public-org-profile.component.css'],
  standalone: false
})
export class PublicOrgProfileComponent implements OnInit {

  org: Organization | null = null;
  services: Service[] = [];
  meanRating: number | null = null;
  isFavorite = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.ownerService.getFavoriteOrgs().subscribe(favs => {
      this.isFavorite = favs.some(o => o.id === id);
    });

    this.ownerService.getOrgById(id).subscribe(org => {
      this.org = org;
      this.loading = false;
    });

    this.ownerService.getOrgServices(id).subscribe(services => {
      this.services = services;
    });

    this.ownerService.getOrgMeanRating(id).subscribe(rating => {
      this.meanRating = rating;
    });
  }

  get formattedRating(): string {
    if (this.meanRating === null) return 'No reviews yet';
    return this.meanRating.toFixed(1) + ' / 5.0';
  }

  toggleFavorite(): void {
    if (!this.org) return;
    if (this.isFavorite) {
      this.ownerService.removeFavoriteOrg(this.org.id).subscribe(() => {
        this.isFavorite = false;
      });
    } else {
      this.ownerService.addFavoriteOrg(this.org.id).subscribe(() => {
        this.isFavorite = true;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/owner-search-orgs']);
  }
}
