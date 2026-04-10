import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-register',
  templateUrl: './owner-register.component.html',
  styleUrls: ['./owner-register.component.css'],
  standalone: false
})
export class OwnerRegisterComponent {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phoneNumber = '';
  handle = '';

  handleTaken = false;
  handleChecking = false;
  handleValid = false;
  submitError = '';

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  onHandleInput(): void {
    // Strip anything that isn't alphanumeric or underscore, force lowercase
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
      this.handle.length >= 3 &&
      this.handleValid
    );
  }

  onRegister(): void {
    if (!this.isFormValid()) return;
    this.ownerService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      handle: this.handle
    }).subscribe({
      next: owner => {
        if (owner) {
          this.router.navigate(['/owner-dashboard']);
        } else {
          this.submitError = 'Registration failed. Please try again.';
        }
      },
      error: () => {
        this.submitError = 'Registration failed. Please try again.';
      }
    });
  }
}
