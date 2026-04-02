import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../services/organization/organization.service';

@Component({
    selector: 'app-org-login',
    templateUrl: './org-login.component.html',
    styleUrls: ['./org-login.component.css'],
    standalone: false
})
export class OrgLoginComponent implements OnInit {

  constructor(
    private router: Router,
    private organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
  }

  email: string = '';
  password: string = '';
  loginError = false;

  onLogin(): void {
    this.organizationService.login(this.email, this.password).subscribe(org => {
      if (org) {
        this.loginError = false;
        this.router.navigate(['/org-dashboard']);
      } else {
        this.loginError = true;
      }
    });
  }

}
