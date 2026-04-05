import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: false
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  activeTab: 'profile' | 'security' = 'profile';
  user: User | null = null;

  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordError = '';
  passwordSuccess = '';

  ngOnInit(): void {
    this.userService.getSession().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.user = user;
    });
  }

  setTab(tab: 'profile' | 'security') {
    this.activeTab = tab;
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  submitChangePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordError = 'New passwords do not match.';
      return;
    }
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Password updated successfully.';
        this.passwordError = '';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: () => {
        this.passwordError = 'Incorrect current password.';
        this.passwordSuccess = '';
      }
    });
  }

}
