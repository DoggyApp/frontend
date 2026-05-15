import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-org-register',
  templateUrl: './org-register.component.html',
  styleUrls: ['./org-register.component.css'],
  standalone: false
})
export class OrgRegisterComponent {

  name = '';
  email = '';
  password = '';
  title = '';
  submitError = '';

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  isFormValid(): boolean {
    return !!(this.name.trim() && this.email.trim() && this.password.trim());
  }

  onRegister(): void {
    if (!this.isFormValid()) return;
    this.submitError = '';

    this.organizationService.register({
      id: 0,
      name: this.name,
      email: this.email,
      password: this.password,
      title: this.title || undefined,
      employees: [],
      dogs: []
    }).subscribe({
      next: org => {
        if (!org) {
          this.submitError = 'Registration failed. Please try again.';
          return;
        }
        this.router.navigate(['/org-login']);
      },
      error: () => {
        this.submitError = 'Registration failed. Please try again.';
      }
    });
  }
}
