import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-owner-login',
  templateUrl: './owner-login.component.html',
  styleUrls: ['./owner-login.component.css'],
  standalone: false
})
export class OwnerLoginComponent {

  email = '';
  password = '';
  loginError = false;

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  onLogin(): void {
    this.ownerService.login(this.email, this.password).subscribe(owner => {
      if (owner) {
        this.loginError = false;
        this.router.navigate(['/owner-dashboard']);
      } else {
        this.loginError = true;
      }
    });
  }
}
