import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css'],
    standalone: false
})
export class UserLoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  loginError = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.userService.login(this.email, this.password).subscribe(user => {
      if (user) {
        this.loginError = false;
        this.router.navigate(['/user-dashboard']);
      } else {
        this.loginError = true;
      }
    });
  }

}
