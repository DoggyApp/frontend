import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Dog } from '../models/dog';
import { User } from '../models/user';
import { Location } from '../models/location';
import { Owner } from '../models/owner';
import { DogService } from '../services/dog/dog.service';
import { UserService } from '../services/user/user.service';
import { OrganizationService } from '../services/organization/organization.service';
import { LocationService } from '../services/location/location.service';
import { ClientService } from '../client.service';

declare const google: any;

@Component({
    selector: 'app-org-dashboard',
    templateUrl: './org-dashboard.component.html',
    styleUrls: ['./org-dashboard.component.css'],
    standalone: false
})
export class OrgDashboardComponent implements OnInit {

  constructor(
    private dogService: DogService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private locationService: LocationService,
    private clientService: ClientService,
    private router: Router
  ) { }

  @ViewChild('addressInput') addressInputRef!: ElementRef<HTMLInputElement>;

  activeTab: 'dogs' | 'employees' | 'locations' | 'clients' = 'dogs';
  dogs: Dog[] = [];
  employees: User[] = [];
  locations: Location[] = [];
  clients: Owner[] = [];

  showAddEmployeeForm = false;
  newEmployee: Omit<User, 'id'> = { firstName: '', lastName: '', email: '', password: '' };

  showAddLocationForm = false;
  newLocation = { name: '', address: '' };
  addressConfirmed = false;

  ngOnInit(): void {
    this.organizationService.getSession().subscribe(org => {
      if (!org) {
        this.router.navigate(['/org-login']);
        return;
      }
    });

    this.dogService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
    });
    this.userService.getUsers().subscribe(employees => {
      this.employees = employees;
    });
    this.locationService.getLocations().subscribe(locations => {
      this.locations = locations.filter(l => !l.offsite);
    });
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
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
    this.userService.addUser(this.newEmployee).subscribe(created => {
      this.employees.push(created);
      this.closeAddEmployeeModal();
    });
  }

  deleteEmployee(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  deleteDog(id: number) {
    this.dogService.deleteDog(id).subscribe(() => {
      this.dogs = this.dogs.filter(d => d.id !== id);
    });
  }

  openAddLocationModal() {
    this.showAddLocationForm = true;
    this.addressConfirmed = false;
    // Wait for *ngIf to render the input before attaching autocomplete
    setTimeout(() => this.initAutocomplete(), 0);
  }

  private initAutocomplete() {
    const input = this.addressInputRef?.nativeElement;
    if (!input || typeof google === 'undefined') return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        this.newLocation.address = place.formatted_address;
        this.addressConfirmed = true;
      }
    });

    // If the user edits the field after confirming, require re-selection
    input.addEventListener('input', () => {
      this.addressConfirmed = false;
    });
  }

  closeAddLocationModal() {
    this.showAddLocationForm = false;
    this.newLocation = { name: '', address: '' };
    this.addressConfirmed = false;
  }

  submitAddLocation() {
    if (!this.addressConfirmed) return;
    this.locationService.addLocation(this.newLocation.name, this.newLocation.address).subscribe(created => {
      this.locations.push(created);
      this.closeAddLocationModal();
    });
  }

  deleteLocation(id: number) {
    this.locationService.deleteLocation(id).subscribe(() => {
      this.locations = this.locations.filter(l => l.id !== id);
    });
  }

  logout() {
    this.organizationService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }

}
