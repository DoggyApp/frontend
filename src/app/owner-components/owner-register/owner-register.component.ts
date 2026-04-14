import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-owner-register',
  templateUrl: './owner-register.component.html',
  styleUrls: ['./owner-register.component.css'],
  standalone: false
})
export class OwnerRegisterComponent implements AfterViewInit {

  @ViewChild('autocompleteContainer') autocompleteContainerRef!: ElementRef<HTMLDivElement>;

  step = 1;

  // Step 1 — owner info
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

  // Step 2 — dog info (optional)
  dogName = '';
  dogBreed = '';
  dogAge: number | null = null;
  dogWeight: number | null = null;
  bordetellaDate = this.todayStr();
  rabiesDate = this.todayStr();

  submitError = '';
  registeredOwnerId: number | null = null;

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initAutocomplete();
  }

  todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  private async initAutocomplete(): Promise<void> {
    await AppComponent.mapsReady;

    const container = this.autocompleteContainerRef?.nativeElement;
    if (!container) return;

    const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary('places') as any;

    const placeAutocomplete = new PlaceAutocompleteElement({
      types: ['address'],
      includedRegionCodes: ['us']
    });

    container.innerHTML = '';
    container.appendChild(placeAutocomplete);

    const handleSelect = async (event: any) => {
      const place = event.place ?? event.detail?.place;
      if (place) {
        try {
          await place.fetchFields({ fields: ['formattedAddress', 'location'] });
          this.ngZone.run(() => {
            this.address = place.formattedAddress ?? (placeAutocomplete as any).value ?? '';
            this.lat = place.location?.lat() ?? null;
            this.lng = place.location?.lng() ?? null;
            this.cdr.detectChanges();
          });
        } catch {
          this.ngZone.run(() => {
            this.address = (placeAutocomplete as any).value ?? '';
            this.lat = null;
            this.lng = null;
            this.cdr.detectChanges();
          });
        }
      } else {
        this.ngZone.run(() => {
          this.address = (placeAutocomplete as any).value ?? '';
          this.cdr.detectChanges();
        });
      }
    };

    placeAutocomplete.addEventListener('gmp-placeselect', handleSelect);
    placeAutocomplete.addEventListener('gmp-select', handleSelect);
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

  isStep1Valid(): boolean {
    return !!(
      this.firstName.trim() &&
      this.lastName.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.phoneNumber.trim() &&
      this.birthday.trim() &&
      this.address.trim() &&
      this.handle.length >= 3 &&
      this.handleValid
    );
  }

  isDogFormValid(): boolean {
    return !!(
      this.dogName.trim() &&
      this.dogBreed.trim() &&
      this.dogAge !== null && this.dogAge > 0 &&
      this.dogWeight !== null && this.dogWeight > 0 &&
      this.bordetellaDate &&
      this.rabiesDate
    );
  }

  // Step 1 submit: register owner and advance to step 2
  onRegisterOwner(): void {
    if (!this.isStep1Valid()) return;
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
        this.step = 2;
      },
      error: () => {
        this.submitError = 'Registration failed. Please try again.';
      }
    });
  }

  // Step 2: add dog then go to dashboard
  onAddDog(): void {
    if (!this.isDogFormValid()) return;

    this.ownerService.addDog(
      { name: this.dogName, breed: this.dogBreed, age: this.dogAge!, weight: this.dogWeight!, image: '' },
      this.bordetellaDate,
      this.rabiesDate
    ).subscribe({
      next: () => this.router.navigate(['/owner-dashboard']),
      error: () => {
        this.submitError = 'Failed to add dog. You can add one from your dashboard.';
      }
    });
  }

  // Step 2: skip dog and go to dashboard
  skipDog(): void {
    this.router.navigate(['/owner-dashboard']);
  }
}
