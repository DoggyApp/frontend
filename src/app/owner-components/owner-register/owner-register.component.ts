import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner/owner.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';

@Component({
  selector: 'app-owner-register',
  templateUrl: './owner-register.component.html',
  styleUrls: ['./owner-register.component.css'],
  standalone: false
})
export class OwnerRegisterComponent implements AfterViewInit {

  @ViewChild('autocompleteContainer') autocompleteContainerRef!: ElementRef<HTMLDivElement>;

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phoneNumber = '';
  birthday = '';
  address = '';
  handle = '';
  lat: number | null = null;
  lng: number | null = null;

  handleTaken = false;
  handleChecking = false;
  handleValid = false;

  submitError = '';

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private placesService: GooglePlacesService
  ) {}

  ngAfterViewInit(): void {
    const container = this.autocompleteContainerRef?.nativeElement;
    if (container) {
      this.placesService.attachPlaceElementWithCoords(container, (addr, lat, lng) => {
        this.address = addr;
        this.lat = lat;
        this.lng = lng;
        if (lat === null || lng === null) {
          this.submitError = 'Could not determine location coordinates. Please try selecting the address again.';
        }
        this.cdr.detectChanges();
      }, { includedRegionCodes: ['us'] });
    }
  }

  onHandleInput(): void {
    this.handle = this.handle.replace(/[^a-z0-9_]/gi, '').toLowerCase();
    this.handleTaken = false;
    this.handleValid = false;

    if (this.handle.length >= 3) {
      this.handleChecking = true;
      this.ownerService.checkHandle(this.handle).subscribe(taken => {
        this.handleChecking = false;
        this.handleTaken = taken;
        this.handleValid = !taken;
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.firstName.trim() &&
      this.lastName.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.phoneNumber.trim() &&
      this.birthday.trim() &&
      this.address.trim() &&
      this.lat !== null &&
      this.lng !== null &&
      this.handle.length >= 3 &&
      this.handleValid
    );
  }

  onRegister(): void {
    if (!this.isFormValid()) return;
    this.submitError = '';

    this.ownerService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      handle: this.handle,
      address: this.address,
      birthday: this.birthday,
      latitude: this.lat ?? undefined,
      longitude: this.lng ?? undefined
    }).subscribe({
      next: owner => {
        if (!owner) {
          this.submitError = 'Registration failed. Please try again.';
          return;
        }
        this.router.navigate(['/owner-login']);
      },
      error: () => {
        this.submitError = 'Registration failed. Please try again.';
      }
    });
  }
}
