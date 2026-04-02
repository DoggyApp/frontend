import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dog } from '../models/dog';
import { User } from '../models/user';
import { DogService } from '../services/dog/dog.service';
import { UserService } from '../services/user/user.service';
import { OrganizationService } from '../services/organization/organization.service';

@Component({
    selector: 'app-org-dashboard',
    templateUrl: './org-dashboard.component.html',
    styleUrls: ['./org-dashboard.component.css'],
    standalone: false
})
export class OrgDashboardComponent implements OnInit {

  constructor(
    private dogService: DogService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private router: Router
  ) { }

  activeTab: 'dogs' | 'employees' = 'dogs';
  dogs: Dog[] = [];
  employees: User[] = [];

  showAddEmployeeForm = false;
  newEmployee: Omit<User, 'id'> = { firstName: '', lastName: '', email: '', password: '' };

  ngOnInit(): void {
    this.organizationService.getSession().subscribe(org => {
      if (!org) {
        this.router.navigate(['/org-login']);
        return;
      }
    });

    this.dogService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
    });
    this.userService.getUsers().subscribe(employees => {
      this.employees = employees;
    });
  }

  setTab(tab: 'dogs' | 'employees') {
    this.activeTab = tab;
  }

  openAddEmployeeModal() {
    this.showAddEmployeeForm = true;
  }

  closeAddEmployeeModal() {
    this.showAddEmployeeForm = false;
    this.newEmployee = { firstName: '', lastName: '', email: '', password: '' };
  }

  submitAddEmployee() {
    this.userService.addUser(this.newEmployee).subscribe(created => {
      this.employees.push(created);
      this.closeAddEmployeeModal();
    });
  }

  deleteEmployee(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  deleteDog(id: number) {
    this.dogService.deleteDog(id).subscribe(() => {
      this.dogs = this.dogs.filter(d => d.id !== id);
    });
  }

  logout() {
    this.organizationService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
