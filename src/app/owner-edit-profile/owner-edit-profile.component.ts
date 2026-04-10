import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Owner } from '../models/owner';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-edit-profile',
  templateUrl: './owner-edit-profile.component.html',
  styleUrls: ['./owner-edit-profile.component.css'],
  standalone: false
})
export class OwnerEditProfileComponent implements AfterViewInit {

  @ViewChild('autocompleteContainer') autocompleteContainerRef!: ElementRef<HTMLDivElement>;

  owner: Owner | null = null;

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  address = '';

  saveSuccess = false;
  saveError = '';

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/owner-login']);
        return;
      }
      this.owner = owner;
      this.firstName = owner.firstName;
      this.lastName = owner.lastName;
      this.email = owner.email;
      this.phoneNumber = owner.phoneNumber;
      this.address = owner.address ?? '';
      this.initAutocomplete();
    });
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

    const handleSelect = () => {
      const selected: string = (placeAutocomplete as any).value ?? '';
      this.ngZone.run(() => {
        this.address = selected;
        this.cdr.detectChanges();
      });
    };

    placeAutocomplete.addEventListener('gmp-placeselect', handleSelect);
    placeAutocomplete.addEventListener('gmp-select', handleSelect);
  }

  isFormValid(): boolean {
    return !!(
      this.firstName.trim() &&
      this.lastName.trim() &&
      this.email.trim() &&
      this.phoneNumber.trim() &&
      this.address.trim()
    );
  }

  onSave(): void {
    if (!this.isFormValid()) return;
    this.saveError = '';
    this.saveSuccess = false;

    this.ownerService.updateProfile({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address
    }).subscribe({
      next: () => {
        this.saveSuccess = true;
      },
      error: () => {
        this.saveError = 'Failed to save changes. Please try again.';
      }
    });
  }
}
