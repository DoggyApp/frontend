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
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initAutocomplete();
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

    const geocode = (address: string): Promise<{ lat: number; lng: number }> => {
      const geocoder = new (window as any).google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results: any[], status: string) => {
          console.log('[Geocoder] status:', status);
          console.log('[Geocoder] results:', results);
          try {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location;
              console.log('[Geocoder] location object:', loc);
              console.log('[Geocoder] typeof loc.lat:', typeof loc.lat);
              const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
              const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
              console.log('[Geocoder] resolved coords:', { lat, lng });
              resolve({ lat, lng });
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    };

    const handleSelect = async (event: any) => {
      const place = event.place ?? event.detail?.place;
      const rawAddress = (placeAutocomplete as any).value ?? '';

      let resolvedAddress = rawAddress;
      let lat: number | null = null;
      let lng: number | null = null;

      if (place) {
        try {
          await place.fetchFields({ fields: ['formattedAddress', 'location'] });
          resolvedAddress = place.formattedAddress ?? rawAddress;
          lat = place.location?.lat() ?? null;
          lng = place.location?.lng() ?? null;
        } catch { /* fall through to geocoder */ }
      }

      if (lat === null || lng === null) {
        try {
          const coords = await geocode(resolvedAddress);
          lat = coords.lat;
          lng = coords.lng;
        } catch (err) {
          console.error('Geocoding failed:', err);
        }
      }

      console.log('[handleSelect] final lat/lng before zone:', { lat, lng, resolvedAddress });
      this.ngZone.run(() => {
        this.address = resolvedAddress;
        this.lat = lat;
        this.lng = lng;
        console.log('[handleSelect] this.lat/lng after zone:', { lat: this.lat, lng: this.lng });
        if (lat === null || lng === null) {
          this.submitError = 'Could not determine location coordinates. Please try selecting the address again.';
        }
        this.cdr.detectChanges();
      });
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