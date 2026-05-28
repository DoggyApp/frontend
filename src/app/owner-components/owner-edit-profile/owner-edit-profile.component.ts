import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerService } from '../../services/owner/owner.service';
import { GooglePlacesService } from '../../services/google-places/google-places.service';
import { PasswordValidatorService } from '../../validators/password-validator.service';

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

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordSuccess = false;
  passwordError = '';

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private placesService: GooglePlacesService,
    private passwordValidator: PasswordValidatorService
  ) {}

  ngAfterViewInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/']);
        return;
      }
      this.owner = owner;
      this.firstName = owner.firstName;
      this.lastName = owner.lastName;
      this.email = owner.email;
      this.phoneNumber = owner.phoneNumber;
      this.address = owner.address ?? '';

      const container = this.autocompleteContainerRef?.nativeElement;
      if (container) {
        this.placesService.attachPlaceElement(container, addr => {
          this.address = addr;
          this.cdr.detectChanges();
        }, { includedRegionCodes: ['us'] });
      }
    });
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

  isPasswordFormValid(): boolean {
    return !!(
      this.oldPassword &&
      this.passwordValidator.isValid(this.newPassword) &&
      this.confirmPassword &&
      this.newPassword === this.confirmPassword
    );
  }

  onChangePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'New passwords do not match.';
      return;
    }
    this.passwordError = '';
    this.passwordSuccess = false;

    this.ownerService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordSuccess = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        if (err.status === 403) {
          this.passwordError = 'Current password is incorrect.';
        } else {
          this.passwordError = 'Failed to update password. Please try again.';
        }
      }
    });
  }
}
