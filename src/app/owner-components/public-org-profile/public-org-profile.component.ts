import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgPublic } from '../../models/org-public';
import { Service } from '../../models/service';
import { Dog } from '../../models/dog';
import { RegistrationRequest } from '../../models/registration-request';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-public-org-profile',
  templateUrl: './public-org-profile.component.html',
  styleUrls: ['./public-org-profile.component.css'],
  standalone: false
})
export class PublicOrgProfileComponent implements OnInit {

  org: OrgPublic | null = null;
  services: Service[] = [];
  meanRating: number | null = null;
  isFavorite = false;
  loading = true;

  // Registration
  myDogs: Dog[] = [];
  sentRequests: RegistrationRequest[] = [];
  selectedDogId: number | null = null;
  registrationError = '';
  registrationSuccess = '';

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

    this.ownerService.getDogs().subscribe(dogs => {
      this.myDogs = dogs;
    });

    this.ownerService.getSentRegistrationRequests().subscribe(requests => {
      this.sentRequests = requests.filter(r => r.organization.id === id);
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

  requestStatus(dogId: number): 'PENDING' | 'ACCEPTED' | 'REJECTED' | null {
    const req = this.sentRequests.find(r => r.dog.id === dogId);
    return req ? req.status : null;
  }

  sendRegistrationRequest(): void {
    if (!this.org || this.selectedDogId === null) return;
    this.registrationError = '';
    this.registrationSuccess = '';

    this.ownerService.sendRegistrationRequest(this.selectedDogId, this.org.id).subscribe({
      next: req => {
        this.sentRequests.push(req);
        this.selectedDogId = null;
        this.registrationSuccess = 'Registration request sent!';
      },
      error: () => {
        this.registrationError = 'Could not send request. It may already exist.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/owner-search-orgs']);
  }
}
