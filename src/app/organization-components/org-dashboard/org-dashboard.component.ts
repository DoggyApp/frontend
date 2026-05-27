import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Dog } from '../../models/dog';
import { User } from '../../models/user';
import { Location } from '../../models/location';
import { Owner } from '../../models/owner';
import { RegistrationRequest } from '../../models/registration-request';
import { OrganizationService } from '../../services/organization/organization.service';
import { AuthService } from '../../services/auth/auth.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';

@Component({
    selector: 'app-org-dashboard',
    templateUrl: './org-dashboard.component.html',
    styleUrls: ['./org-dashboard.component.css'],
    standalone: false
})
export class OrgDashboardComponent implements OnInit {

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private placesService: GooglePlacesService
  ) { }

  @ViewChild('autocompleteContainer') autocompleteContainerRef!: ElementRef<HTMLDivElement>;

  activeTab: 'dogs' | 'employees' | 'locations' | 'clients' = 'dogs';
  dogs: Dog[] = [];
  employees: User[] = [];
  locations: Location[] = [];
  clients: Owner[] = [];

  pendingRegistrationRequests: RegistrationRequest[] = [];
  showRegistrationRequestsDropdown = false;

  showAddEmployeeForm = false;
  newEmployee: Omit<User, 'id'> = { firstName: '', lastName: '', email: '', password: '' };

  showAddLocationForm = false;
  newLocation = { name: '', address: '', latitude: null as number | null, longitude: null as number | null };

  ngOnInit(): void {
    this.organizationService.getSession().subscribe(org => {
      if (!org) {
        this.router.navigate(['/']);
        return;
      }
      this.authService.setSession('org');
    });

    this.organizationService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
    });
    this.organizationService.getUsers().subscribe(employees => {
      this.employees = employees;
    });
    this.organizationService.getLocations().subscribe(locations => {
      this.locations = locations.filter(l => !l.offsite);
    });
    this.organizationService.getClients().subscribe(clients => {
      this.clients = clients;
    });

    this.organizationService.getPendingRegistrationRequests().subscribe(requests => {
      this.pendingRegistrationRequests = requests;
    });
  }

  // ── Registration Requests ─────────────────────────────────────────────────

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    if (!target.closest('.reg-requests-wrapper')) {
      this.showRegistrationRequestsDropdown = false;
    }
  }

  toggleRegistrationRequestsDropdown(): void {
    this.showRegistrationRequestsDropdown = !this.showRegistrationRequestsDropdown;
  }

  acceptRegistrationRequest(request: RegistrationRequest): void {
    this.organizationService.acceptRegistrationRequest(request.id).subscribe(() => {
      this.pendingRegistrationRequests = this.pendingRegistrationRequests.filter(r => r.id !== request.id);
      this.organizationService.getDogs().subscribe(dogs => {
        this.dogs = dogs;
      });
    });
  }

  rejectRegistrationRequest(request: RegistrationRequest): void {
    this.organizationService.rejectRegistrationRequest(request.id).subscribe(() => {
      this.pendingRegistrationRequests = this.pendingRegistrationRequests.filter(r => r.id !== request.id);
    });
  }

  setTab(tab: 'dogs' | 'employees' | 'locations' | 'clients') {
    this.activeTab = tab;
  }

  openAddEmployeeModal() {
    this.showAddEmployeeForm = true;
  }

  closeAddEmployeeModal() {
    this.showAddEmployeeForm = false;
    this.newEmployee = { firstName: '', lastName: '', email: '', password: '' };
  }

  submitAddEmployee() {
    this.organizationService.addUser(this.newEmployee).subscribe(created => {
      this.employees.push(created);
      this.closeAddEmployeeModal();
    });
  }

  deleteEmployee(id: number) {
    this.organizationService.deleteUser(id).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  deleteDog(id: number) {
    this.organizationService.deleteDog(id).subscribe(() => {
      this.dogs = this.dogs.filter(d => d.id !== id);
    });
  }

  openAddLocationModal() {
    this.showAddLocationForm = true;
    this.newLocation = { name: '', address: '', latitude: null, longitude: null };
    setTimeout(() => {
      const container = this.autocompleteContainerRef?.nativeElement;
      if (container) {
        this.placesService.attachPlaceElementWithCoords(container, (addr, lat, lng) => {
          this.newLocation.address = addr;
          this.newLocation.latitude = lat;
          this.newLocation.longitude = lng;
          this.cdr.detectChanges();
        }, { includedRegionCodes: ['us'] });
      }
    }, 0);
  }

  closeAddLocationModal() {
    this.showAddLocationForm = false;
    this.newLocation = { name: '', address: '', latitude: null, longitude: null };
  }

  submitAddLocation() {
    if (!this.newLocation.name.trim() || !this.newLocation.address.trim()) return;
    this.organizationService.addLocation(
      this.newLocation.name,
      this.newLocation.address,
      this.newLocation.latitude,
      this.newLocation.longitude
    ).subscribe(created => {
      this.locations.push(created);
      this.closeAddLocationModal();
    });
  }

  deleteLocation(id: number) {
    this.organizationService.deleteLocation(id).subscribe(() => {
      this.locations = this.locations.filter(l => l.id !== id);
    });
  }

  logout() {
    this.organizationService.logout().subscribe({
      next: () => { this.authService.clearSession(); this.router.navigate(['/']); },
      error: () => { this.authService.clearSession(); this.router.navigate(['/']); }
    });
  }

}
