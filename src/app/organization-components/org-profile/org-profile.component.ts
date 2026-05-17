import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organization } from '../../models/organization';
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.css'],
  standalone: false
})
export class OrgProfileComponent implements OnInit {

  org: Organization | null = null;

  profileForm = { name: '', email: '' };
  profileSuccess = '';
  profileError = '';

  passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
  passwordSuccess = '';
  passwordError = '';

  renewSuccess = '';
  renewError = '';

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.organizationService.getSession().subscribe(org => {
      if (!org) {
        this.router.navigate(['/']);
        return;
      }
      this.org = org;
      this.profileForm.name = org.name;
      this.profileForm.email = org.email;
    });
  }

  saveProfile(): void {
    this.profileSuccess = '';
    this.profileError = '';
    this.organizationService.updateProfile(this.profileForm.name, this.profileForm.email).subscribe({
      next: updated => {
        this.org = updated;
        this.profileSuccess = 'Profile updated successfully.';
      },
      error: () => {
        this.profileError = 'Failed to update profile. Please try again.';
      }
    });
  }

  savePassword(): void {
    this.passwordSuccess = '';
    this.passwordError = '';
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New passwords do not match.';
      return;
    }
    this.organizationService.changePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully.';
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: () => {
        this.passwordError = 'Incorrect current password or invalid new password.';
      }
    });
  }

  renewMembership(): void {
    this.renewSuccess = '';
    this.renewError = '';
    this.organizationService.renew().subscribe({
      next: updated => {
        this.org = updated;
        this.renewSuccess = 'Membership renewed successfully for one year.';
      },
      error: () => {
        this.renewError = 'Failed to renew membership. Please try again.';
      }
    });
  }
}
