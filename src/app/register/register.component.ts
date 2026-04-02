import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization/organization.service';
import { Router } from '@angular/router';
import { Organization } from '../models/organization';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
  }

  registerError = '';

  public organization: Organization = {
    id: 0,
    name: '',
    email: '',
    password: '',
    dogs: [],
    employees: []
  };

  confirmPassword = '';

  onSubmit() {
    if (this.organization.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.organizationService.register(this.organization).subscribe(registeredOrg => {
      if (registeredOrg) {
        this.registerError = '';
        this.router.navigate(['/org-login']);
      } else {
        this.registerError = 'You already have an account.';
      }
    });
  }

}
