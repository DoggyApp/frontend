import { Component, OnInit } from '@angular/core';
import { DogService } from '../services/dog/dog.service';
import { UserService } from '../services/user/user.service';
import { Dog } from '../models/dog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(
    private dogService: DogService,
    private userService: UserService,
    private router: Router
  ) { }

  dogs: Dog[] = [];

  ngOnInit(): void {
    this.userService.getSession().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
    });

    this.dogService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
