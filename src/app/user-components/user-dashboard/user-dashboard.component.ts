import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Dog } from '../../models/dog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css'],
    standalone: false
})
export class UserDashboardComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  dogs: Dog[] = [];

  ngOnInit(): void {
    this.userService.getSession().subscribe(user => {
      if (!user) {
        this.router.navigate(['/user-login']);
        return;
      }
    });

    this.userService.getDogs().subscribe(dogs => {
      this.dogs = dogs;
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.authService.clearSession();
      this.router.navigate(['/']);
    });
  }

}
